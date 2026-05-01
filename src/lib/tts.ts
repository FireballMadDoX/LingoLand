let cachedVoices: SpeechSynthesisVoice[] = [];

function getLanguageCode(lang: string) {
  if (lang.startsWith("es")) return "es";
  if (lang.startsWith("zh")) return "zh";
  return "en";
}

function isBadVoice(voice: SpeechSynthesisVoice) {
  const name = voice.name.toLowerCase();

  return (
    name.includes("compact") ||
    name.includes("bad news") ||
    name.includes("bells") ||
    name.includes("boing") ||
    name.includes("bubbles") ||
    name.includes("cellos") ||
    name.includes("deranged") ||
    name.includes("good news") ||
    name.includes("hysterical") ||
    name.includes("pipe organ") ||
    name.includes("trinoids") ||
    name.includes("whisper") ||
    name.includes("zarvox")
  );
}

function chooseBestVoice(lang: string) {
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  const langCode = getLanguageCode(lang);

  const preferredVoices: Record<string, string[]> = {
    en: ["Samantha", "Alex", "Google US English", "Microsoft Aria"],
    es: ["Mónica", "Monica", "Paulina", "Google español", "Microsoft Elvira"],
    zh: ["Ting-Ting", "Mei-Jia", "Sin-ji", "Google 普通话", "Microsoft Xiaoxiao"],
  };

  const preferred = preferredVoices[langCode];

  return (
    voices.find(
      (v) =>
        preferred.some((name) => v.name.toLowerCase().includes(name.toLowerCase())) &&
        v.lang.toLowerCase().startsWith(langCode) &&
        !isBadVoice(v)
    ) ||
    voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase() && !isBadVoice(v)) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(langCode) && !isBadVoice(v)) ||
    null
  );
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();

    if (voices.length > 0) {
      cachedVoices = voices;
      resolve(voices);
      return;
    }

    synth.onvoiceschanged = () => {
      cachedVoices = synth.getVoices();
      resolve(cachedVoices);
    };
  });
}

export async function speak(text: string, lang: string = "en-US") {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis is not supported.");
    return;
  }

  const synth = window.speechSynthesis;
  synth.cancel();

  await loadVoices();

  const utterance = new SpeechSynthesisUtterance(text);
  if (lang.startsWith("zh")) {
  utterance.rate = 0.5; // MUCH slower for Mandarin
} else if (lang.startsWith("es")) {
  utterance.rate = 0.7; // slightly slower Spanish
} else {
  utterance.rate = 0.9; // normal English
}
  utterance.pitch = 1.05;
  utterance.volume = 1;
  utterance.lang = lang;

  const voice = chooseBestVoice(lang);

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
    console.log("Using voice:", voice.name, voice.lang);
  } else {
    console.warn("No native voice found for:", lang);
  }

  synth.speak(utterance);
}
