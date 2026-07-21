import { defineManifest } from "@crxjs/vite-plugin";

import packageJson from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: "Mongo Shot",
  description: "Saves a JPEG screenshot to a local folder after every click.",
  version: packageJson.version,
  icons: {
    16: "icons/icon16.png",
    32: "icons/icon32.png",
    48: "icons/icon48.png",
    128: "icons/icon128.png",
  },
  action: {
    default_popup: "src/popup/index.html",
    default_icon: {
      16: "icons/icon16.png",
      32: "icons/icon32.png",
      48: "icons/icon48.png",
      128: "icons/icon128.png",
    },
  },
  background: {
    service_worker: "src/background/serviceWorker.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content/clickListener.ts"],
      all_frames: true,
      run_at: "document_idle",
    },
  ],
  permissions: ["downloads", "storage"],
  host_permissions: ["<all_urls>"],
});
