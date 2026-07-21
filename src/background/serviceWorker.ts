import { CLICK_MESSAGE, MANUAL_CAPTURE_MESSAGE } from "../lib/messages";
import { DEFAULT_SETTINGS, getSettings } from "../lib/settings";

// chrome.tabs.captureVisibleTab is rate-limited (~2 calls/sec per extension);
// this keeps rapid clicks from silently failing every other capture.
const MIN_CAPTURE_INTERVAL_MS = 300;
let lastCaptureAt = 0;

function timestampForFilename(): string {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function captureAndSave(
  windowId: number,
  { ignoreEnabled = false }: { ignoreEnabled?: boolean } = {},
): Promise<void> {
  const settings = await getSettings();
  if (!ignoreEnabled && !settings.enabled) return;

  const now = Date.now();
  if (now - lastCaptureAt < MIN_CAPTURE_INTERVAL_MS) return;
  lastCaptureAt = now;

  let dataUrl: string;
  try {
    dataUrl = await chrome.tabs.captureVisibleTab(windowId, {
      format: "jpeg",
      quality: settings.quality,
    });
  } catch (err) {
    console.warn("mongo-shot: capture failed", err);
    return;
  }

  const filename = `${settings.subfolder}/screenshot-${timestampForFilename()}.jpg`;

  try {
    await chrome.downloads.download({
      url: dataUrl,
      filename,
      saveAs: false,
      conflictAction: "uniquify",
    });
  } catch (err) {
    console.warn("mongo-shot: download failed", err);
  }
}

async function captureActiveTab(): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.windowId) return;
  await captureAndSave(tab.windowId, { ignoreEnabled: true });
}

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type === CLICK_MESSAGE) {
    if (!sender.tab?.windowId) return;
    void captureAndSave(sender.tab.windowId);
    return;
  }
  if (message?.type === MANUAL_CAPTURE_MESSAGE) {
    void captureActiveTab();
    return;
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(null);
  await chrome.storage.local.set({ ...DEFAULT_SETTINGS, ...existing });
});
