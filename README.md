# Mongo Shot

A Chrome extension that saves a JPEG screenshot to your Downloads folder every time you click on a webpage — or on demand with a manual capture button.

This isn't published on the Chrome Web Store, so it's loaded as an "unpacked" extension. No build step needed — just download and load the `dist` folder.

## Get the files

Either:

- Click **Code → Download ZIP** on the [GitHub repo page](https://github.com/opskelsey/mongo-shot), then unzip it, or
- Clone it: `git clone https://github.com/opskelsey/mongo-shot.git`

## Load into Chrome

1. Open `chrome://extensions`
2. Toggle on **Developer mode** (top right) — Chrome will show a "Developer mode extensions" warning banner; that's expected for unpacked extensions
3. Click **Load unpacked** and select the `dist` folder from the files you downloaded
4. The starburst icon should appear in your toolbar

## Using it

Click the toolbar icon to open the popup:

- **Downloads subfolder** — name of the subfolder (under your Downloads directory) where screenshots are saved
- **JPEG quality** — Low / Medium / High
- **Start auto-capture on click** — click to turn on; every click on a webpage after this saves a screenshot. Click again ("Auto-capturing — click to stop") to turn it off
- **Capture current view** — takes a single screenshot of whatever tab you're currently viewing, regardless of the auto-capture setting

> Content scripts only inject into pages loaded *after* the extension is installed or reloaded — refresh any tab you want to test on first.

## Known limitations

- Only captures the visible tab area (viewport), not the full scrollable page
- Only sees clicks on webpages, not clicks in other apps, the OS desktop, or Chrome's own UI (address bar, etc.)
- Chrome rate-limits tab screenshots to about 2/second; very rapid clicking may skip some captures
- Files always save under Chrome's configured download directory — to point it at a specific folder, set that as the default download location in `chrome://settings/downloads`
