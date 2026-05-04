# Live App Content

The app loads live content from:

```text
https://servicioselpaisano.com/app-content.json
```

At runtime it uses this order:

1. Bundled fallback content so the app always opens.
2. Cached server content from the last successful refresh.
3. Fresh `app-content.json` from the webserver.

This means website content can update without a new app release as long as the
webserver keeps `app-content.json` current.

## No-Manual-Maintenance Workflow

Set up the webserver deploy, cron job, or hosting build step to run:

```bash
node scripts/parse-site.mjs --server-out /path/to/public_html/app-content.json
```

That script crawls the live HTML pages and writes the JSON file the app reads.
The app does not parse raw HTML on the phone because that is brittle, slower,
and harder to validate safely.

## Override URL

For staging or a different hosting path, build the app with:

```bash
EXPO_PUBLIC_SITE_CONTENT_URL=https://example.com/app-content.json
```

Only use public, non-secret URLs here. Expo public environment variables are
embedded in the app bundle.
