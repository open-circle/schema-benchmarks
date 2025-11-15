/**
 * Calculate the time to download a file at a given speed.
 * @param bytes - Size in bytes
 * @param mbps - Speed in megabits per second
 * @returns Time in milliseconds
 */
export const getDownloadTime = (bytes: number, mbps: number) =>
  (bytes * 8) / (mbps * 1000);
