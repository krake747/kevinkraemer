# Security Policy

This is a personal portfolio with no user accounts, no database, and no server-side secrets in the
repo. The only request-time surface is the `/ask` and `/mcp` endpoints, whose keys live in Doppler
and never in files.

## Reporting a vulnerability

Report through a private GitHub security advisory on this repo. Do not open a public issue for a
suspected vulnerability.

Expect an initial response within 7 days. There is no bug bounty; this is a solo maintainer project.

## Scope

In scope: the deployed site and the code in this repo. Out of scope: third-party services (Netlify,
Cloudflare, Doppler). Report those to the vendor.
