import { CLICK_MESSAGE } from "../lib/messages";

document.addEventListener(
  "click",
  () => {
    chrome.runtime.sendMessage({ type: CLICK_MESSAGE }).catch(() => {
      // Extension context may be invalidated (e.g. reloaded) between page
      // loads; ignore, the next click on a freshly loaded page will work.
    });
  },
  { capture: true },
);
