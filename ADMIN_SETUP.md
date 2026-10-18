# Content Admin — Setup Guide

This lets you and your staff edit the website's content (pricing, contact
info, FAQs, and more as it's added) without touching code. Changes you save
here commit straight to the website's GitHub repo and go live automatically
within about 1-2 minutes.

**There is no separate username/password system.** Each person uses their
own GitHub account to prove they're allowed to edit the site. This guide
walks through getting that set up, once per person.

## 1. Get a GitHub account added to the repo

If you don't already have a GitHub account, create one for free at
https://github.com/join.

Ask the site owner to add your GitHub username as a collaborator on the
`Leeshwaan04/mrandmrslaundry` repository:
**GitHub repo → Settings → Collaborators → Add people.**

## 2. Create your personal access token

This is like a password that only works for editing this one website, and
can be turned off at any time without affecting your main GitHub login.

1. Go to https://github.com/settings/personal-access-tokens/new
2. **Token name**: something recognizable, e.g. `mrandmrslaundry-admin`
3. **Expiration**: pick 90 days (you'll just repeat this guide to make a
   new one when it expires — that's intentional, it limits the damage if a
   token is ever lost or stolen)
4. **Repository access**: choose "Only select repositories" and pick
   `Leeshwaan04/mrandmrslaundry`
5. **Permissions**: expand "Repository permissions" and set **Contents** to
   **Read and write**. Leave everything else as "No access".
6. Click **Generate token**.
7. Copy the token that appears (it starts with `github_pat_`). **You will
   not be able to see it again after leaving this page** — if you lose it,
   just generate a new one.

## 3. Log into the admin page

1. Open `https://leeshwaan04.github.io/mrandmrslaundry/admin/`
2. Paste your token and click **Continue**.
3. That's it — the token stays saved in your browser so you won't need to
   paste it again on that device, until it expires.

## 4. Making an edit

1. Pick a content section from the dashboard (e.g. "Business Info").
2. Change whatever you need to change.
3. Click **Save & publish**.
4. The site rebuilds automatically — give it about 1-2 minutes, then check
   the live site to confirm your change is there.

If you see a message that someone else changed the same file while you were
editing: click **Reload latest**, then redo your edit on the fresh version.
This is rare, but happens if two people save the same section at almost the
same time.

## 5. If something goes live by mistake

Every save is a plain, visible commit on GitHub, so it's always undoable:

1. Go to the repo on GitHub → **Commits** (or ask the owner to).
2. Find the commit (it'll say "Update ... via admin").
3. Click it → **Revert** — this creates a new commit undoing exactly that
   change, and the site rebuilds back to how it was, same ~1-2 minute wait.

## 6. Revoking someone's access

If a staff member leaves, or a device with a saved token is lost or stolen,
the owner should immediately go to:
**GitHub → Settings → Developer settings → Personal access tokens →
Fine-grained tokens**, find that person's token, and click **Revoke**.
This takes effect immediately — no further steps needed, and nothing else
about the site needs to change.

## Good to know

- There's no approval or review step: whatever you save goes live. Double
  check before clicking **Save & publish**.
- Only the content sections listed on the dashboard are editable here.
  Anything marked "Coming soon" isn't wired up yet.
- This only edits content (text, prices, etc.) — it never touches how the
  site looks or works. That still requires a developer.
