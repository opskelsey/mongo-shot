export interface Settings {
  enabled: boolean;
  subfolder: string;
  quality: number;
}

export const DEFAULT_SETTINGS: Settings = {
  enabled: false,
  subfolder: "click-shots",
  quality: 80,
};

export async function getSettings(): Promise<Settings> {
  return chrome.storage.local.get<Settings>(DEFAULT_SETTINGS);
}

export async function setSettings(partial: Partial<Settings>): Promise<void> {
  await chrome.storage.local.set(partial);
}

export function onSettingsChanged(
  callback: (settings: Settings) => void,
): void {
  getSettings().then(callback);
  chrome.storage.onChanged.addListener((_changes, areaName) => {
    if (areaName !== "local") return;
    getSettings().then(callback);
  });
}
