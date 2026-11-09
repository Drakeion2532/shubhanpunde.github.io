# shubhanpunde.github.io

Source of Shubhan Punde's portfolio: IAM / IGA analyst and detection engineer.

**Live site:** https://shubhanpunde.com/

- Landing page with a simulated live threat map, results, experience, 15 project case studies, research and credentials.
- Plain HTML, CSS and JavaScript. No build step, no trackers, no third-party requests; a strict Content-Security-Policy.
- Designed in Figma first (Material 3 tokens, WCAG 2.2 AA contrast), desktop-first.

## How it's deployed

- Hosted on **Vercel**, connected to this repo. Every push to `main` goes live in about a minute; every other branch gets a private preview URL.
- `vercel.json` sets the security headers (HSTS, CSP with `frame-ancestors 'none'`, nosniff, Referrer-Policy, Permissions-Policy, COOP/CORP) and caching.
- The old GitHub Pages address forwards visitors to https://shubhanpunde.com/ with the same page path.
- Nothing secret lives here: it is a static site with no API keys, tokens or server code. `.gitignore` blocks `.env` and key files.

© 2026 Shubhan Punde. All rights reserved. See [NOTICE](NOTICE). Build `sp2532-1bb845a51c97`.
