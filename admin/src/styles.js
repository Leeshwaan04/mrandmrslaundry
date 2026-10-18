// Shared inline-style tokens, matching the main site's dark/Apple-ish look
// closely enough to feel like the same product without pulling in its
// animation-heavy dependencies.

export const colors = {
  bg: '#000000',
  panel: 'rgba(15, 16, 22, 0.85)',
  border: 'rgba(255, 255, 255, 0.1)',
  text: '#f5f5f7',
  textDim: '#86868b',
  accent: '#2997ff',
  success: '#30d158',
  danger: '#ff453a',
  warning: '#ffd60a',
};

export const page = {
  minHeight: '100vh',
  backgroundColor: colors.bg,
  color: colors.text,
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: '32px 24px 80px',
};

export const card = {
  background: colors.panel,
  border: `1px solid ${colors.border}`,
  borderRadius: '20px',
  padding: '28px',
  backdropFilter: 'blur(16px)',
};

export const input = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  background: 'rgba(255,255,255,0.06)',
  border: `1px solid ${colors.border}`,
  color: colors.text,
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box',
};

export const label = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: colors.textDim,
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

export const button = (variant = 'primary') => ({
  padding: '12px 20px',
  borderRadius: '12px',
  border: 'none',
  fontSize: '0.92rem',
  fontWeight: 700,
  cursor: 'pointer',
  background:
    variant === 'primary' ? colors.accent : variant === 'danger' ? colors.danger : 'rgba(255,255,255,0.08)',
  color: '#fff',
});

export const banner = (variant) => ({
  padding: '12px 16px',
  borderRadius: '12px',
  fontSize: '0.88rem',
  marginBottom: '18px',
  background:
    variant === 'error'
      ? 'rgba(255, 69, 58, 0.15)'
      : variant === 'success'
      ? 'rgba(48, 209, 88, 0.15)'
      : 'rgba(255, 214, 10, 0.12)',
  color: variant === 'error' ? '#ff6961' : variant === 'success' ? colors.success : colors.warning,
  border: `1px solid ${
    variant === 'error' ? 'rgba(255,69,58,0.35)' : variant === 'success' ? 'rgba(48,209,88,0.35)' : 'rgba(255,214,10,0.3)'
  }`,
});
