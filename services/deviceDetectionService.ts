// ======================================================
// File: services/deviceDetectionService.ts
// English AI Coach
// Speech Engine v2
// Device Detection Service
// ======================================================

export interface DeviceInfo {

  platform: string;

  browser: string;

  isAndroid: boolean;

  isIOS: boolean;

  isDesktop: boolean;

  isSupported: boolean;

}

export function getDeviceInfo(): DeviceInfo {

  if (typeof window === "undefined") {

    return {

      platform: "Server",

      browser: "Unknown",

      isAndroid: false,

      isIOS: false,

      isDesktop: false,

      isSupported: false,

    };

  }

  const ua = navigator.userAgent;

  const isAndroid = /Android/i.test(ua);

  const isIOS =
    /iPhone|iPad|iPod/i.test(ua);

  const isDesktop =
    !isAndroid && !isIOS;

  let browser = "Unknown";

  if (/Edg/i.test(ua)) {

    browser = "Edge";

  } else if (/Chrome/i.test(ua)) {

    browser = "Chrome";

  } else if (/Firefox/i.test(ua)) {

    browser = "Firefox";

  } else if (/Safari/i.test(ua)) {

    browser = "Safari";

  }

  const SpeechRecognitionSupported =

    typeof window !== "undefined" &&

    (

      "SpeechRecognition" in window ||

      "webkitSpeechRecognition" in window

    );

  return {

    platform: isAndroid

      ? "Android"

      : isIOS

      ? "iOS"

      : "Desktop",

    browser,

    isAndroid,

    isIOS,

    isDesktop,

    isSupported:

      SpeechRecognitionSupported,

  };

}
