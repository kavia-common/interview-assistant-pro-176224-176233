beforeAll(() => {
  // Provide minimal speechSynthesis and SpeechRecognition stubs to avoid errors when components reference them.
  if (!('speechSynthesis' in window)) {
    Object.defineProperty(window, 'speechSynthesis', {
      value: { speak: () => {}, cancel: () => {} },
      configurable: true
    });
  }
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    // Minimal stub so code path detects support=false and renders fallback
    Object.defineProperty(window, 'webkitSpeechRecognition', {
      value: function MockRec() {},
      configurable: true
    });
  }
});
