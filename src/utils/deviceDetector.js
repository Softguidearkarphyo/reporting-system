import FingerprintJS from '@fingerprintjs/fingerprintjs';

export async function getDeviceMetaData() {
  let deviceUUID = null;

  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    deviceUUID = result.visitorId;
  } catch (err) {
    console.warn('FingerprintJS load error:', err);
  }

  const hasTouchScreen = navigator.maxTouchPoints > 0;

  let isLaptop = false;
  let isDesktop = false;

  if ('getBattery' in navigator) {
    try {
      const battery = await navigator.getBattery();
      
      const isPluggedDesktopPattern = 
        battery.charging === true && 
        battery.level === 1 && 
        battery.dischargingTime === Infinity;

      if (!isPluggedDesktopPattern) {
        isLaptop = true;
      } else {
        isDesktop = true;
      }
    } catch (e) {
      console.warn('Battery API Error:', e);
    }
  }

  if (!isDesktop && hasTouchScreen && !/Android|iPhone|iPad/i.test(navigator.userAgent)) {
    isLaptop = true;
  }

  return {
    deviceUUID,
    isLaptop,
    hasTouchScreen,
    userAgent: navigator.userAgent
  };
}