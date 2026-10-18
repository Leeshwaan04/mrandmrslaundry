// Thin wrapper around GitHub's REST Contents API, called directly from the
// browser with a staff member's own fine-grained Personal Access Token.
// No backend/proxy involved — see ADMIN_SETUP.md for how a token is created.

export const OWNER = 'Leeshwaan04';
export const REPO = 'mrandmrslaundry';
export const BRANCH = 'main';

const API_BASE = 'https://api.github.com';
const TOKEN_KEY = 'mml_admin_gh_token';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch (e) {
    return '';
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    /* noop — private browsing etc. */
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    /* noop */
  }
}

export class ConflictError extends Error {
  constructor(path) {
    super(`"${path}" was changed by someone else since you opened it.`);
    this.name = 'ConflictError';
    this.path = path;
  }
}

export class AuthError extends Error {
  constructor(message) {
    super(message || 'Your token is invalid, expired, or lacks repo access.');
    this.name = 'AuthError';
  }
}

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function base64ToUtf8(b64) {
  const binary = atob(b64.replace(/\n/g, ''));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    },
  });
  return res;
}

// Confirms the stored token can actually read this repo. Throws AuthError if not.
export async function validateToken() {
  const res = await request(`/repos/${OWNER}/${REPO}`);
  if (res.status === 401 || res.status === 403) {
    throw new AuthError('GitHub rejected this token — check it has "Contents: Read and write" on this repo and has not expired.');
  }
  if (res.status === 404) {
    throw new AuthError('This token cannot see the repo (wrong repo access or private-repo scope missing).');
  }
  if (!res.ok) {
    throw new AuthError(`Unexpected response validating token (HTTP ${res.status}).`);
  }
  return res.json();
}

// Fetches a JSON content file. Returns { data (parsed object), sha, lastCommit }.
export async function getJsonFile(path) {
  const res = await request(`/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`);
  if (res.status === 401 || res.status === 403) throw new AuthError();
  if (!res.ok) throw new Error(`Failed to load ${path} (HTTP ${res.status})`);
  const json = await res.json();
  const text = base64ToUtf8(json.content);
  return { data: JSON.parse(text), sha: json.sha };
}

// Writes a JSON content file back. `sha` must be the one returned by the
// getJsonFile() call this edit started from — GitHub rejects a stale sha
// with 409, which we surface as ConflictError for the UI to handle.
export async function putJsonFile(path, data, sha, message) {
  const content = utf8ToBase64(JSON.stringify(data, null, 2) + '\n');
  const res = await request(`/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content,
      sha,
      branch: BRANCH,
    }),
  });

  if (res.status === 409) throw new ConflictError(path);
  if (res.status === 401 || res.status === 403) throw new AuthError();
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Failed to save ${path} (HTTP ${res.status})`);
  }
  return res.json();
}

// Uploads a binary file (e.g. a gallery image). `base64Content` is the raw
// base64 of the file bytes (no data: prefix). `sha` is only needed when
// overwriting an existing file at that path; omit it when creating a new one.
export async function putBinaryFile(path, base64Content, message, sha) {
  const res = await request(`/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: base64Content,
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });

  if (res.status === 409) throw new ConflictError(path);
  if (res.status === 401 || res.status === 403) throw new AuthError();
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Failed to upload ${path} (HTTP ${res.status})`);
  }
  return res.json();
}

// Informational only — lets the UI show "last changed" before editing.
export async function getLastCommit(path) {
  const res = await request(`/repos/${OWNER}/${REPO}/commits?path=${encodeURIComponent(path)}&per_page=1&sha=${BRANCH}`);
  if (!res.ok) return null;
  const commits = await res.json();
  if (!commits.length) return null;
  return {
    message: commits[0].commit.message,
    author: commits[0].commit.author?.name,
    date: commits[0].commit.author?.date,
  };
}
