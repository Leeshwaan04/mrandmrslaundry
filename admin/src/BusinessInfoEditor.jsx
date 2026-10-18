import React, { useEffect, useState } from 'react';
import { getJsonFile, putJsonFile, getLastCommit, ConflictError, AuthError } from './GitHubApi';
import { page, card, input, label, button, banner } from './styles';

const PATH = 'content/business-info.json';

export default function BusinessInfoEditor({ onBack, onAuthError }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(null);
  const [sha, setSha] = useState(null);
  const [lastCommit, setLastCommit] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [file, commit] = await Promise.all([getJsonFile(PATH), getLastCommit(PATH)]);
      setData(file.data);
      setSha(file.sha);
      setLastCommit(commit);
    } catch (err) {
      if (err instanceof AuthError) return onAuthError();
      setError(err.message || 'Failed to load content/business-info.json');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (path, value) => {
    setData((prev) => {
      const next = structuredClone(prev);
      let cursor = next;
      for (let i = 0; i < path.length - 1; i++) cursor = cursor[path[i]];
      cursor[path[path.length - 1]] = value;
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setStatus('');
    try {
      const payload = { ...data, _meta: { ...(data._meta || {}), lastUpdated: new Date().toISOString().slice(0, 10) } };
      await putJsonFile(PATH, payload, sha, 'Update business info via admin');
      setStatus('Saved — the live site will update automatically in about 1-2 minutes once the deploy finishes.');
      await load();
    } catch (err) {
      if (err instanceof AuthError) return onAuthError();
      if (err instanceof ConflictError) {
        setError('Someone else saved a change to this file while you were editing. Click "Reload latest" below, then reapply your edit.');
      } else {
        setError(err.message || 'Failed to save.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={page}>
        <p>Loading…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={page}>
        {error && <div style={banner('error')}>{error}</div>}
        <button style={button('secondary')} onClick={onBack}>← Back</button>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <button style={{ ...button('secondary'), marginBottom: '20px' }} onClick={onBack}>
          ← Back to dashboard
        </button>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>Business Info</h1>
        <p style={{ fontSize: '0.85rem', color: '#86868b', marginBottom: '20px' }}>
          Phone, email, addresses, hours and the delivery coverage list — shown across the whole site.
          {lastCommit && (
            <>
              {' '}
              Last changed {new Date(lastCommit.date).toLocaleString()} by {lastCommit.author || 'unknown'}.
            </>
          )}
        </p>

        {error && (
          <div style={banner('error')}>
            {error}{' '}
            <button style={{ ...button('secondary'), marginLeft: '8px', padding: '6px 12px', fontSize: '0.8rem' }} onClick={load}>
              Reload latest
            </button>
          </div>
        )}
        {status && <div style={banner('success')}>{status}</div>}

        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={label}>Phone / WhatsApp (shown as)</label>
            <input style={input} value={data.phone} onChange={(e) => update(['phone'], e.target.value)} />
          </div>
          <div>
            <label style={label}>Phone digits (no + or spaces, e.g. 919152233822)</label>
            <input
              style={input}
              value={data.phoneDigits}
              onChange={(e) => update(['phoneDigits'], e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>
          <div>
            <label style={label}>Email</label>
            <input style={input} value={data.email} onChange={(e) => update(['email'], e.target.value)} />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '4px 0' }} />

          {data.addresses.map((addr, i) => (
            <div key={addr.id}>
              <label style={label}>{addr.label} — label</label>
              <input
                style={{ ...input, marginBottom: '10px' }}
                value={addr.label}
                onChange={(e) => update(['addresses', i, 'label'], e.target.value)}
              />
              <label style={label}>{addr.label} — full description</label>
              <textarea
                style={{ ...input, minHeight: '70px', fontFamily: 'inherit', resize: 'vertical' }}
                value={addr.line1}
                onChange={(e) => update(['addresses', i, 'line1'], e.target.value)}
              />
            </div>
          ))}

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '4px 0' }} />

          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={{ flex: 1 }}>
              <label style={label}>Open days/hours</label>
              <input style={input} value={data.hours.openDays} onChange={(e) => update(['hours', 'openDays'], e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>Closed days</label>
              <input style={input} value={data.hours.closedDays} onChange={(e) => update(['hours', 'closedDays'], e.target.value)} />
            </div>
          </div>

          <div>
            <label style={label}>Minimum order for free delivery (₹)</label>
            <input
              style={input}
              type="number"
              value={data.minOrderForFreeDelivery}
              onChange={(e) => update(['minOrderForFreeDelivery'], Number(e.target.value))}
            />
          </div>

          <div>
            <label style={label}>Delivery coverage areas (comma-separated)</label>
            <textarea
              style={{ ...input, minHeight: '70px', fontFamily: 'inherit', resize: 'vertical' }}
              value={data.localities.join(', ')}
              onChange={(e) =>
                update(
                  ['localities'],
                  e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                )
              }
            />
          </div>

          <button style={{ ...button('primary'), alignSelf: 'flex-start' }} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save & publish'}
          </button>
        </div>
      </div>
    </div>
  );
}
