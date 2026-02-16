interface SpeedPreset {
  name: string;
  /** Mbps, not Mb/s */
  mbps: number;
  icon: string;
}

/*
from chrome devtools:
regular 2g: 250kb/s
good 2g: 450kb/s
regular 3g: 750kb/s
good 3g: 1Mb/s
regular 4g: 4Mb/s
WiFi: 30 Mb/s
*/

export const speedPresets = {
  "3g": {
    name: "3G (750kb/s)",
    mbps: 750 / 125,
    icon: "3g_mobiledata",
  },
  "4g": { name: "4G (4Mb/s)", mbps: 4 * 8, icon: "4g_mobiledata" },
  wifi: { name: "WiFi (30Mb/s)", mbps: 30 * 8, icon: "wifi" },
} as const satisfies Record<string, SpeedPreset>;

/**
 * Calculate the time to download a file at a given speed.
 * @param bytes - Size in bytes
 * @param mbps - Speed in megabits per second
 * @returns Time in milliseconds
 */
export const getDownloadTime = (bytes: number, mbps: number) => (bytes * 8) / (mbps * 1000);
