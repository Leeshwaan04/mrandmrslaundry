import React, { useState } from 'react';
import { setToken, validateToken, AuthError } from './GitHubApi';
import { page, card, input, label, button, banner } from './styles';

export default function Login({ onLoggedIn }) {
  const [tokenInput, setTokenInput] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    setChecking(true);
    setError('');
    setToken(tokenInput.trim());
    try {
      await validateToken();
      onLoggedIn();
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
        setToken('');
      } else {
        // Transient failure (network blip, GitHub 5xx) — keep the token so the
        // user can just retry instead of re-pasting it.
        setError('Could not reach GitHub. Check your connection and try again.');
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <div style={{ ...page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...card, maxWidth: '440px', width: '100%' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px' }}>Mr &amp; Mrs Laundry — Content Admin</h1>
        <p style={{ fontSize: '0.88rem', color: '#86868b', margin: '0 0 24px' }}>
          Paste your GitHub personal access token to edit site content. It's stored only in this browser and used
          directly against GitHub's API — nothing is sent anywhere else. First time here? See{' '}
          <code>ADMIN_SETUP.md</code> in the repo for how to create one.
        </p>

        {error && <div style={banner('error')}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={label}>GitHub Personal Access Token</label>
          <input
            style={{ ...input, marginBottom: '18px' }}
            type="password"
            autoComplete="off"
            spellCheck={false}
            placeholder="github_pat_..."
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
          />
          <button type="submit" style={{ ...button('primary'), width: '100%' }} disabled={checking}>
            {checking ? 'Checking access…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
