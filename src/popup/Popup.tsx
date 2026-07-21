import { useEffect, useState } from "react";

import { MANUAL_CAPTURE_MESSAGE } from "../lib/messages";
import { onSettingsChanged, Settings, setSettings } from "../lib/settings";
import "./popup.css";

export function Popup() {
  const [settings, setLocalSettings] = useState<Settings | null>(null);
  const [justCaptured, setJustCaptured] = useState(false);

  useEffect(() => {
    onSettingsChanged(setLocalSettings);
  }, []);

  if (!settings) return null;

  const handleCaptureNow = () => {
    chrome.runtime.sendMessage({ type: MANUAL_CAPTURE_MESSAGE });
    setJustCaptured(true);
    setTimeout(() => setJustCaptured(false), 1500);
  };

  return (
    <div className="popup">
      <h1 className="popup-title">Mongo Shot</h1>

      <label className="popup-field">
        <span>Downloads subfolder</span>
        <input
          type="text"
          value={settings.subfolder}
          onChange={(e) => setSettings({ subfolder: e.target.value })}
        />
        <small>Relative to Chrome's default download location</small>
      </label>

      <label className="popup-field">
        <span>JPEG quality</span>
        <select
          value={settings.quality}
          onChange={(e) => setSettings({ quality: Number(e.target.value) })}
        >
          <option value={60}>Low</option>
          <option value={80}>Medium</option>
          <option value={95}>High</option>
        </select>
      </label>

      <div className="popup-button-group">
        <button
          type="button"
          className={`popup-toggle-button${settings.enabled ? " active" : ""}`}
          onClick={() => setSettings({ enabled: !settings.enabled })}
        >
          {settings.enabled && <span className="popup-live-dot" />}
          {settings.enabled
            ? "Auto-capturing — click to stop"
            : "Start auto-capture on click"}
        </button>

        <button
          type="button"
          className="popup-capture-button"
          onClick={handleCaptureNow}
        >
          {justCaptured ? "Captured!" : "Capture current view"}
        </button>
      </div>
    </div>
  );
}
