// ======================================================
// Speech Recognition Manager
// English AI Coach
// ======================================================

let recognitionInstance: any = null;

export function registerRecognition(
  recognition: any
) {
  recognitionInstance = recognition;
}

export function getRecognition() {
  return recognitionInstance;
}

export function pauseRecognition() {

  if (!recognitionInstance) {
    return;
  }

  try {

    recognitionInstance.stop();

  } catch {

    // ignore

  }

}

export function resumeRecognition() {

  if (!recognitionInstance) {
    return;
  }

  try {

    recognitionInstance.start();

  } catch {

    // ignore

  }

}