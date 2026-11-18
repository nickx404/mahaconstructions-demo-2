# Client presentation hosting

The approved review setup is GitHub Pages hosting, GoDaddy domain registration/DNS and the existing Google Apps Script enquiry backend. This is a presentation before the client approves the public launch.

- Repository: `nickx404/mahaconstructions-demo-2`, branch `main`.
- Presentation domain: `mahaconstructions.in`, with `www` redirected to the apex through GitHub Pages.
- The same finished design is presented without demo labels, GitHub branding or additional placeholder notices. Preview indexing remains disabled through metadata, with no visible site badge.
- The workflow runs `npm run build`, which prerenders every route and keeps `noindex`. Its asset base comes from `actions/configure-pages`, supporting both the repository URL and the later custom-domain root.
- Public website email stays `saimaha1000@gmail.com`. The receiver's `NOTIFICATION_EMAIL` stays `smsathish1000@gmail.com`.
- `VITE_CHATBOT_LEAD_URL` must be present as a repository Actions variable. It is the public receiver endpoint, not an email credential. The receiver must allow `https://nickx404.github.io`, `https://mahaconstructions.in` and `https://www.mahaconstructions.in`.

## Domain connection

GoDaddy currently requires the owner to complete .IN KYC before DNS editing is available. Keep the working repository preview until this is complete. Do not assign a custom domain in Pages while it cannot yet be pointed to GitHub, since that would redirect visitors away from the working preview.

Once DNS editing is available, add the custom domain to the repository's Pages settings, rebuild using the root asset base, and then replace only the web-serving DNS records with GitHub Pages' records:

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | nickx404.github.io |

Preserve the existing MX, SPF, DKIM, DMARC, mail CNAME, SRV and nameserver records. Keep the separate `saimaha.com` hosting unchanged. Verify domain ownership in GitHub where supported, enable HTTPS after certificate issuance and test direct page links, media and all four enquiry entry points from the actual domain.

After client approval, the same files/domain can move to the chosen production host. Switch to the indexable production build, verify redirects/HTTPS and submit the sitemap through Search Console. Hosting migration does not require changing the visible design or notification recipient.
