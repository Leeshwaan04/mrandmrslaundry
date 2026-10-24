import React, { useEffect, useState } from 'react';
import { getJsonFile, putJsonFile, getLastCommit, ConflictError, AuthError } from './GitHubApi';
import { page, card, input, label, button, banner, colors } from './styles';

const PATH = 'content/leads.json';

const MUMBAI_LOCALITIES = [
  'Tardeo',
  'Bandra West',
  'Worli',
  'Lower Parel',
  'Malad East',
  'Malad West',
  'Juhu',
  'Andheri West',
  'Andheri East',
  'Powai',
  'Colaba',
  'Malabar Hill',
  'Breach Candy',
  'Prabhadevi',
  'Dadar West',
  'Marine Drive',
  'Nariman Point',
  'Khar West',
  'Santacruz West',
  'Vile Parle West',
  'Goregaon West',
  'Goregaon East',
  'Kandivali West',
  'Kandivali East',
  'Borivali West',
  'Borivali East',
  'Dadar East & Matunga',
  'Chembur',
  'Ghatkopar',
  'Thane West',
  'Vashi (Navi Mumbai)',
  // The exact strings the public site's booking form offers (content/business-info.json)
  // so a lead transcribed from a WhatsApp message can match what the customer actually picked.
  'Colaba / Cuffe Parade',
  'Goregaon',
  'Navi Mumbai',
  'Thane',
  'Other / Mumbai Unspecified'
];

const SERVICES = [
  'Wash & Fold (₹99/Kg)',
  'Wash & Steam Iron (₹129/Kg)',
  'Designer Dry Cleaning (₹199+)',
  'Executive Suit Dry Cleaning',
  'Silk Saree & Lehenga Care',
  'Sneaker & Shoe Spa (₹299+)',
  'Heavy Curtain & Quilt Care (₹349+)',
  'Express 24-Hour Laundry',
  // The exact option values shown on the public booking form / contact page, so a lead
  // transcribed from WhatsApp can be logged with the service the customer actually selected.
  'Wash & Fold Laundry (₹99/Kg)',
  'Wash & Iron Laundry (₹159/Kg)',
  'Dry Cleaning (Starts @ ₹99)',
  'Shoe Laundry & Spa (Starts @ ₹299)',
  'Express 24h Laundry (₹299/Kg)',
  'Premium Garment Care (₹199/Kg)',
  'Heavy Laundry & Quilts (₹159/Kg)',
  'Curtain & Drapery Care'
];

const STATUS_OPTIONS = [
  'New Inquiry',
  'Pickup Scheduled',
  'In Wash',
  'Delivered',
  'Cancelled'
];

// Timestamp-derived so a concurrent admin add can't collide — collision-free as long as
// two leads aren't added in the exact same millisecond from the exact same browser tab.
function generateLeadId(existingLeads) {
  const candidate = `MML-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 36).toString(36).toUpperCase()}`;
  const taken = new Set(existingLeads.map((l) => l.id));
  return taken.has(candidate) ? `${candidate}X` : candidate;
}

// Guards against CSV/formula injection (CWE-1236): Excel/Sheets treats a cell starting
// with =, +, -, or @ as a formula regardless of surrounding quotes, so every phone number
// (which starts with "+") would otherwise open as a broken formula on every export.
function sanitizeCsvField(value) {
  const str = String(value ?? '');
  const guarded = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
  return `"${guarded.replace(/"/g, '""')}"`;
}

export default function LeadsManager({ onBack, onAuthError }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [leads, setLeads] = useState([]);
  const [sha, setSha] = useState(null);
  const [lastCommit, setLastCommit] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocality, setFilterLocality] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // New Lead Modal / Form
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [newLead, setNewLead] = useState({
    customerName: '',
    phone: '',
    locality: 'Tardeo',
    pincode: '',
    address: '',
    service: 'Wash & Fold (₹99/Kg)',
    slot: 'Today, 2:00 PM – 4:00 PM',
    notes: '',
    status: 'New Inquiry'
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [file, commit] = await Promise.all([getJsonFile(PATH), getLastCommit(PATH)]);
      setLeads(file.data?.leads || []);
      setSha(file.sha);
      setLastCommit(commit);
    } catch (err) {
      if (err instanceof AuthError) return onAuthError();
      setError(err.message || 'Failed to load content/leads.json');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = (leadId, newStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
  };

  const handleDeleteLead = (leadId) => {
    if (window.confirm(`Are you sure you want to delete lead ${leadId}?`)) {
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
    }
  };

  const handleAddLeadSubmit = (e) => {
    e.preventDefault();
    if (!newLead.customerName || !newLead.phone) {
      alert('Please enter at least customer name and phone number.');
      return;
    }

    const createdLead = {
      id: generateLeadId(leads),
      ...newLead,
      createdAt: new Date().toISOString(),
      source: 'Admin / Phone Inflow'
    };

    setLeads((prev) => [createdLead, ...prev]);
    setIsAddingLead(false);
    setNewLead({
      customerName: '',
      phone: '',
      locality: 'Tardeo',
      pincode: '',
      address: '',
      service: 'Wash & Fold (₹99/Kg)',
      slot: 'Today, 2:00 PM – 4:00 PM',
      notes: '',
      status: 'New Inquiry'
    });
  };

  const handleSaveToGitHub = async () => {
    if (!window.confirm('Publish these changes to the live leads database now? This commits directly to production.')) {
      return;
    }
    setSaving(true);
    setError('');
    setStatus('');
    try {
      const payload = {
        _meta: {
          lastUpdated: new Date().toISOString().slice(0, 10),
          description: 'Mr & Mrs Laundry Customer Leads, Pickups and Inquiries Database'
        },
        leads
      };
      await putJsonFile(PATH, payload, sha, 'Update customer leads database via admin');
      setStatus('Saved successfully — leads database updated in repository!');
      await load();
    } catch (err) {
      if (err instanceof AuthError) return onAuthError();
      if (err instanceof ConflictError) {
        setError('Database was modified by another session. Please reload and re-apply changes.');
      } else {
        setError(err.message || 'Failed to save leads.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = () => {
    if (!leads.length) return alert('No leads to export.');
    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Locality', 'Pincode', 'Address', 'Service', 'Slot', 'Status', 'Notes', 'Source'];
    const rows = leads.map((l) => [
      sanitizeCsvField(l.id),
      sanitizeCsvField(l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-IN') : ''),
      sanitizeCsvField(l.customerName),
      sanitizeCsvField(l.phone),
      sanitizeCsvField(l.locality),
      sanitizeCsvField(l.pincode),
      sanitizeCsvField(l.address),
      sanitizeCsvField(l.service),
      sanitizeCsvField(l.slot),
      sanitizeCsvField(l.status),
      sanitizeCsvField(l.notes),
      sanitizeCsvField(l.source)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MrMrsLaundry_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Neighborhood Breakdown Analytics
  const neighborhoodCounts = {};
  leads.forEach((l) => {
    const loc = l.locality || 'Unspecified';
    neighborhoodCounts[loc] = (neighborhoodCounts[loc] || 0) + 1;
  });
  const sortedNeighborhoods = Object.entries(neighborhoodCounts).sort((a, b) => b[1] - a[1]);

  // Leads Per Day (last 14 days) — relies on every lead having a createdAt, so this is only
  // as accurate as staff are disciplined about logging walk-in/phone leads the same day.
  const DAYS_TO_SHOW = 14;
  const dailyCounts = [];
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
    const day = new Date(todayStart);
    day.setDate(day.getDate() - i);
    const key = day.toISOString().slice(0, 10);
    dailyCounts.push({ key, label: day.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), count: 0 });
  }
  const dailyCountsByKey = Object.fromEntries(dailyCounts.map((d) => [d.key, d]));
  leads.forEach((l) => {
    if (!l.createdAt) return;
    const key = l.createdAt.slice(0, 10);
    if (dailyCountsByKey[key]) dailyCountsByKey[key].count += 1;
  });
  const maxDailyCount = Math.max(1, ...dailyCounts.map((d) => d.count));
  const last7 = dailyCounts.slice(-7).reduce((sum, d) => sum + d.count, 0);
  const avgPerDay = (last7 / 7).toFixed(1);

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      (l.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.phone || '').includes(searchTerm) ||
      (l.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.address || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocality = filterLocality === 'ALL' || l.locality === filterLocality;
    const matchesStatus = filterStatus === 'ALL' || l.status === filterStatus;

    return matchesSearch && matchesLocality && matchesStatus;
  });

  return (
    <div style={page}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Navigation & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button style={button('secondary')} onClick={onBack}>
            ← Back to Dashboard
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={button('secondary')} onClick={handleExportCSV}>
              📥 Export to CSV
            </button>
            <button style={button('primary')} onClick={() => setIsAddingLead(true)}>
              ➕ Log New Walk-in / Phone Lead
            </button>
            <button style={{ ...button('primary'), background: colors.success }} onClick={handleSaveToGitHub} disabled={saving}>
              {saving ? 'Saving...' : '💾 Save & Publish'}
            </button>
          </div>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px', color: '#fff' }}>
            Leads &amp; Doorstep Pickups Manager
          </h1>
          <p style={{ fontSize: '0.88rem', color: colors.textDim, margin: 0 }}>
            Track, filter, and organize incoming customer booking requests across Mumbai micro-markets.
            {lastCommit && ` (Last saved ${new Date(lastCommit.date).toLocaleDateString('en-IN')})`}
          </p>
        </div>

        {/* Informational Banner */}
        <div style={banner('info')}>
          ℹ️ <strong>Lead Routing Notice:</strong> Inquiries submitted via the live website's Booking CTA automatically open WhatsApp with the customer's pre-filled details sent directly to <strong>+91 9152233822</strong>. This portal provides your centralized customer ledger, status tracking, and neighborhood analytics.
        </div>

        {status && <div style={banner('success')}>{status}</div>}
        {error && <div style={banner('error')}>{error}</div>}

        {/* Analytics Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div style={card}>
            <div style={{ fontSize: '0.8rem', color: colors.accent, fontWeight: 700, textTransform: 'uppercase' }}>Total Inquiries</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>{leads.length}</div>
          </div>
          <div style={card}>
            <div style={{ fontSize: '0.8rem', color: colors.warning, fontWeight: 700, textTransform: 'uppercase' }}>Active In-Wash</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
              {leads.filter((l) => l.status === 'In Wash' || l.status === 'Pickup Scheduled').length}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize: '0.8rem', color: colors.success, fontWeight: 700, textTransform: 'uppercase' }}>Delivered</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
              {leads.filter((l) => l.status === 'Delivered').length}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize: '0.8rem', color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase' }}>Top Neighborhood</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
              {sortedNeighborhoods[0] ? `${sortedNeighborhoods[0][0]} (${sortedNeighborhoods[0][1]})` : '—'}
            </div>
          </div>
        </div>

        {/* Neighborhood Leaderboard Pills */}
        <div style={{ ...card, padding: '16px 20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '0.78rem', color: colors.textDim, fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
            Inquiries by Neighborhood:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {sortedNeighborhoods.map(([neighborhood, count]) => (
              <span
                key={neighborhood}
                onClick={() => setFilterLocality(filterLocality === neighborhood ? 'ALL' : neighborhood)}
                style={{
                  background: filterLocality === neighborhood ? colors.accent : 'rgba(255,255,255,0.06)',
                  color: filterLocality === neighborhood ? '#fff' : colors.text,
                  border: `1px solid ${filterLocality === neighborhood ? colors.accent : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '8px',
                  padding: '4px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                📍 {neighborhood}: <strong>{count}</strong>
              </span>
            ))}
          </div>
        </div>

        {/* Leads Per Day Trend */}
        <div style={{ ...card, padding: '16px 20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontSize: '0.78rem', color: colors.textDim, fontWeight: 700, textTransform: 'uppercase' }}>
              Leads Logged Per Day (Last {DAYS_TO_SHOW} Days)
            </div>
            <div style={{ fontSize: '0.8rem', color: colors.textDim }}>
              Avg last 7 days: <strong style={{ color: '#fff' }}>{avgPerDay}/day</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '90px' }}>
            {dailyCounts.map((d) => (
              <div key={d.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }} title={`${d.label}: ${d.count} lead${d.count === 1 ? '' : 's'}`}>
                <div style={{ fontSize: '0.68rem', color: colors.textDim, marginBottom: '4px' }}>{d.count || ''}</div>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '26px',
                    height: `${Math.max(4, (d.count / maxDailyCount) * 56)}px`,
                    background: d.count ? colors.accent : 'rgba(255,255,255,0.08)',
                    borderRadius: '4px 4px 0 0'
                  }}
                />
                <div style={{ fontSize: '0.62rem', color: colors.textDim, marginTop: '6px', whiteSpace: 'nowrap' }}>{d.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.72rem', color: colors.textDim, marginTop: '14px' }}>
            ⚠️ Only reflects leads actually logged into this ledger (via "Log New Walk-in / Phone Lead" or a saved edit) — WhatsApp/call inquiries that staff haven't transcribed yet won't show here.
          </div>
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <input
            style={{ ...input, flex: '1 1 240px' }}
            placeholder="🔍 Search by name, phone, order ID, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            style={{ ...input, flex: '0 1 200px', cursor: 'pointer' }}
            value={filterLocality}
            onChange={(e) => setFilterLocality(e.target.value)}
          >
            <option value="ALL">All Localities</option>
            {MUMBAI_LOCALITIES.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <select
            style={{ ...input, flex: '0 1 180px', cursor: 'pointer' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Add Lead Modal Form */}
        {isAddingLead && (
          <div style={{ ...card, marginBottom: '24px', border: `1px solid ${colors.accent}`, background: '#090d16' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 16px', color: colors.accent }}>
              Log New Customer Pickup / Phone Inquiry
            </h3>
            <form onSubmit={handleAddLeadSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={label}>Customer Name *</label>
                  <input
                    style={input}
                    required
                    placeholder="e.g. Rahul Kapoor"
                    value={newLead.customerName}
                    onChange={(e) => setNewLead({ ...newLead, customerName: e.target.value })}
                  />
                </div>
                <div>
                  <label style={label}>Phone Number *</label>
                  <input
                    style={input}
                    required
                    placeholder="e.g. +91 98200 12345"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label style={label}>Locality / Neighborhood *</label>
                  <select
                    style={input}
                    value={newLead.locality}
                    onChange={(e) => setNewLead({ ...newLead, locality: e.target.value })}
                  >
                    {MUMBAI_LOCALITIES.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={label}>Service Requested</label>
                  <select
                    style={input}
                    value={newLead.service}
                    onChange={(e) => setNewLead({ ...newLead, service: e.target.value })}
                  >
                    {SERVICES.map((srv) => (
                      <option key={srv} value={srv}>
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={label}>Pincode</label>
                  <input
                    style={input}
                    placeholder="e.g. 400034"
                    value={newLead.pincode}
                    onChange={(e) => setNewLead({ ...newLead, pincode: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={label}>Pickup Time Slot</label>
                  <input
                    style={input}
                    placeholder="e.g. Today, 2:00 PM – 4:00 PM"
                    value={newLead.slot}
                    onChange={(e) => setNewLead({ ...newLead, slot: e.target.value })}
                  />
                </div>
                <div>
                  <label style={label}>Address / Building / Landmark</label>
                  <input
                    style={input}
                    placeholder="e.g. Flat 402, Sea Face Apts, Worli"
                    value={newLead.address}
                    onChange={(e) => setNewLead({ ...newLead, address: e.target.value })}
                  />
                </div>
                <div>
                  <label style={label}>Special Notes / Wash Instructions</label>
                  <input
                    style={input}
                    placeholder="e.g. 5kg wash & fold, delicate woolens"
                    value={newLead.notes}
                    onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" style={button('secondary')} onClick={() => setIsAddingLead(false)}>
                  Cancel
                </button>
                <button type="submit" style={button('primary')}>
                  Save Lead to Ledger
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Leads Table / Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: colors.textDim }}>Loading customer leads...</div>
        ) : filteredLeads.length === 0 ? (
          <div style={{ ...card, textAlign: 'center', padding: '40px', color: colors.textDim }}>
            No leads match your current search/filter criteria.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredLeads.map((lead) => {
              const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
              const waText = encodeURIComponent(
                `Hello ${lead.customerName || 'there'}! This is Mr & Mrs Laundry confirming your pickup request in ${lead.locality || 'Mumbai'}.`
              );
              const waLink = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${waText}`;

              return (
                <div
                  key={lead.id}
                  style={{
                    ...card,
                    padding: '20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    borderLeft: `4px solid ${
                      lead.status === 'Delivered'
                        ? colors.success
                        : lead.status === 'In Wash'
                        ? colors.accent
                        : lead.status === 'Pickup Scheduled'
                        ? colors.warning
                        : '#94a3b8'
                    }`
                  }}
                >
                  <div style={{ flex: '1 1 300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{lead.customerName}</span>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px', color: colors.textDim }}>
                        {lead.id}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: colors.accent, fontWeight: 600 }}>
                        📍 {lead.locality}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.86rem', color: colors.textDim, marginBottom: '6px' }}>
                      📞 <strong>{lead.phone}</strong> &bull; 🧺 {lead.service}
                    </div>

                    {lead.address && (
                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '4px' }}>
                        🏠 {lead.address}{lead.pincode ? ` — ${lead.pincode}` : ''}
                      </div>
                    )}

                    {lead.notes && (
                      <div style={{ fontSize: '0.8rem', color: '#a1a1aa', fontStyle: 'italic' }}>
                        📝 {lead.notes}
                      </div>
                    )}

                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '6px' }}>
                      ⏰ Window: {lead.slot || 'Flexible'} &bull; Received: {lead.createdAt ? new Date(lead.createdAt).toLocaleString('en-IN') : 'Recent'} &bull; Source: {lead.source || 'Website'}
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <a
                      href={`tel:${lead.phone}`}
                      style={{
                        ...button('secondary'),
                        padding: '8px 14px',
                        fontSize: '0.82rem',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}
                    >
                      📞 Call
                    </a>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        ...button('primary'),
                        background: '#16a34a',
                        padding: '8px 14px',
                        fontSize: '0.82rem',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}
                    >
                      💬 WhatsApp
                    </a>

                    <select
                      style={{
                        ...input,
                        width: 'auto',
                        padding: '8px 12px',
                        fontSize: '0.82rem',
                        background: 'rgba(255,255,255,0.08)',
                        cursor: 'pointer'
                      }}
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    >
                      {/* If a lead's stored status isn't one of the known options (e.g. hand-edited
                          JSON), surface it as its own option instead of silently showing the wrong one. */}
                      {!STATUS_OPTIONS.includes(lead.status) && lead.status && (
                        <option value={lead.status}>{lead.status} (unrecognized)</option>
                      )}
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>

                    <button
                      style={{
                        ...button('danger'),
                        padding: '8px 12px',
                        fontSize: '0.82rem'
                      }}
                      onClick={() => handleDeleteLead(lead.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

