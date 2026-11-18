# Website enquiry delivery setup

Homepage, Joint Venture, Contact and chatbot forms all use this receiver, with required name and phone and optional email. Page forms also send location, selected enquiry types and an optional message. Live delivery needs a client-owned Google Sheet and Apps Script deployment. No email credentials belong in the React app.

1. Create a private Google Sheet in the client's Google account. Copy its ID from the URL between `/d/` and `/edit`.
2. Open **Extensions → Apps Script**, paste `Code.gs`, and save. Use the V8 runtime.
3. In **Project Settings → Script properties**, add:
   - `SPREADSHEET_ID`: the sheet ID.
   - `NOTIFICATION_EMAIL`: the confirmed recipient, `smsathish1000@gmail.com`.
   - `ALLOWED_ORIGINS`: comma-separated exact website origins, without paths or trailing slashes. Use `http://localhost:5173,http://127.0.0.1:5173,https://nickx404.github.io,https://mahaconstructions.in,https://www.mahaconstructions.in`. This enables local development, the GitHub Pages test site, and the confirmed future domain (with or without www). GitHub Pages uses only the origin here, without `/mahaconstructions-demo-2/`. Test on localhost first, then GitHub Pages; move to the custom domain after final review. Adding its origin does not change DNS or publish the site there.
4. Deploy as a **Web app**, execute as **Me**, access **Anyone**. Authorize Sheets and Mail access as the owning client. Copy the deployed `/exec` URL. Keep the Sheet private; only the receiving web app is public. Updates to the script require updating its deployment version.

5. For local development, create `.env.local` with `VITE_CHATBOT_LEAD_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec` and restart Vite. For GitHub Pages, set repository **Actions variable** `VITE_CHATBOT_LEAD_URL` and rebuild/deploy. This URL is public configuration, not a secret.
6. Before enabling for real visitors, submit a clearly marked sample enquiry with an owned phone number. Confirm a Sheet row, notification email, and the page form's received confirmation or chatbot's resumed answer. Test all four entry points. Check retries reuse the row, page reload reuses the saved contact in the same tab, and a blocked/failed request retains the form without claiming success. Check desktop and mobile. Delete sample data afterwards.

## Sheet display

For an existing receiver deployment, update its **Script properties → NOTIFICATION_EMAIL** to `smsathish1000@gmail.com` too. Website text changes do not change the server-side recipient. A property-only change does not require deploying a new code version; the receiver reads this property on each submission.

The public website email and `mailto:` links remain `saimaha1000@gmail.com`. Only form/chatbot enquiry notification delivery uses `smsathish1000@gmail.com`; do not replace the public address with the notification recipient.

- Lead ID is retained in hidden column A for retry deduplication. Do not delete or reorder receiver columns.
- Created at (IST) displays date and time as `17 Nov 2026, 09:45:00 PM`. The receiver sets the workbook time zone to Asia/Kolkata and formats existing date cells as well as new entries; retrying preserves the original creation timestamp.
- To apply receiver code changes, replace Code.gs in Apps Script, save, then use Deploy → Manage deployments → Edit → New version → Deploy. The existing /exec URL stays the same. The display updates on the next submitted enquiry.

## Delivery behavior

- A hidden form posts to Google. The receiver returns a nonce-bound `postMessage` receipt from a Google origin only after writing the row. A blind `no-cors` request is not treated as success.
- Each chatbot tab session has one random lead ID. Each page form keeps one lead ID through failed attempts and retries; after a confirmed save, changing a field starts a new enquiry. Controls are disabled while a page form is sending, fields remain intact on errors and success, and a saved form cannot resend until edited. Retries update that row rather than duplicating it. Visitor email is optional and is stored in column K; existing sheets get that header without shifting columns. Only creation sends a notification. Later enquiry location/project details update the same row; email contains the contact, source, enquiry types, location, project (when supplied), message, first question and a Sheet link.
- Email failure or exhausted Google quotas do not lose a saved Sheet lead; the Email status column records the failure. Check that column regularly. No automatic email retry is included.
- The public receiver validates inputs, serializes writes, and escapes spreadsheet formulas. Origin checking is not bot authentication. For higher traffic or spam, add a server-verified CAPTCHA and rate limiting before public launch. Google service quotas still apply.
- New deployments create a `Website enquiries` tab. Existing `Chatbot leads` tabs are reused without shifting columns. Source, Enquiry types and Message are appended in columns L–N. Page forms collect up to 2,000 message characters. The legacy configuration name `VITE_CHATBOT_LEAD_URL` now enables all four entry points.
- Without a deployment URL, page forms show an honest not-connected message and never claim success. No live delivery can be verified until the client deploys the receiver.
- WhatsApp notifications are not included in this phase.
- Without a deployment URL, Continue keeps details only in the current browser tab session and resumes the pending answer. The mini form has no storage or connection-status message, and no saved/sent confirmation is displayed. These local drafts are not delivered automatically later. After configuring a receiver, the visitor must submit the mini form to deliver a lead.

Google references: [web apps](https://developers.google.com/apps-script/guides/web), [HTML iframe restrictions](https://developers.google.com/apps-script/guides/html/restrictions), [quotas](https://developers.google.com/apps-script/guides/services/quotas).
