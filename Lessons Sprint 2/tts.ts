let voicesReady = false;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) return resolve([]);

    const synth = window.speechSynthesis;
    const v = synth.getVoices();

    if (v && v.length) {
      voicesReady = true;
      return resolve(v);
    }

    const handler = () => {
      const vv = synth.getVoices();
      voicesReady = true;
      synth.removeEventListener("voiceschanged", handler);
      resolve(vv);
    };

    synth.addEventListener("voiceschanged", handler);

    setTimeout(() => {
      if (!voicesReady) {
        voicesReady = true;
        synth.removeEventListener("voiceschanged", handler);
        resolve(synth.getVoices());
      }
    }, 800);
  });
}

function normalizeText(s: string) {
  return (s ?? "")
    .replaceAll("’", "'")
    .replaceAll("…", "")
    .replaceAll("\u00A0", " ")
    .trim();
}

function normalizeLang(lang: string) {
  return (lang ?? "en-US").replaceAll("\u00A0", " ").trim();
}

// ✅ FIXED: now filters by language too
function findVoiceByPreferredNames(
  voices: SpeechSynthesisVoice[],
  preferredNames: string[],
  langPrefix: string
) {
  for (const name of preferredNames) {
    const match = voices.find(
      (v) =>
        v.name?.toLowerCase().includes(name.toLowerCase()) &&
        v.lang?.toLowerCase().startsWith(langPrefix.toLowerCase())
    );
    if (match) return match;
  }
  return null;
}

function pickBestVoice(voices: SpeechSynthesisVoice[], lang: string) {
  const target = lang.toLowerCase();
  const short = target.split("-")[0];

  // English (clean, natural voices)
  if (target.startsWith("en")) {
    const preferredEnglish = ["Samantha", "Alex", "Karen", "Moira", "Daniel"];
    const preferred = findVoiceByPreferredNames(voices, preferredEnglish, "en");
    if (preferred) return preferred;
  }

  // Spanish (FORCE actual Spanish voices only)
  if (target.startsWith("es")) {
    const preferredSpanish = ["Monica", "Paulina", "Jorge", "Marisol"];
    const preferred = findVoiceByPreferredNames(voices, preferredSpanish, "es");
    if (preferred) return preferred;
  }

  // Mandarin
  if (target.startsWith("zh")) {
  const preferredChinese = [
    "Ting-Ting",
    "Mei-Jia",
    "Sin-ji",
    "Yu-shu",
    "Chinese",
    "Mandarin"
  ];
  const preferred = findVoiceByPreferredNames(voices, preferredChinese, "zh");
  if (preferred) return preferred;
}

  // fallback hierarchy
  const exactLocal = voices.find(
    (v) => v.lang?.toLowerCase() === target && v.localService
  );
  if (exactLocal) return exactLocal;

  const exact = voices.find((v) => v.lang?.toLowerCase() === target);
  if (exact) return exact;

  const sameLangLocal = voices.find(
    (v) => v.lang?.toLowerCase().startsWith(short) && v.localService
  );
  if (sameLangLocal) return sameLangLocal;

  const sameLang = voices.find((v) =>
    v.lang?.toLowerCase().startsWith(short)
  );
  if (sameLang) return sameLang;

  return null;
}

export async function speak(text: string, lang: string, rate = 0.75) {
  if (!("speechSynthesis" in window)) return;

  const synth = window.speechSynthesis;

  const safeText = normalizeText(text);
  const safeLang = normalizeLang(lang);

  if (!safeText) return;

  synth.cancel();

  const voices = await loadVoices();

  const u = new SpeechSynthesisUtterance(safeText);
  u.lang = safeLang;
  u.volume = 1;

  // Language-specific speeds (better clarity)
 if (safeLang.startsWith("en")) {
  u.rate = 0.8;
  u.pitch = 0.95;
} else if (safeLang.startsWith("es")) {
  u.rate = 0.75;
  u.pitch = 0.95;
} else if (safeLang.startsWith("zh")) {
  u.rate = 0.38;
  u.pitch = 0.9;
} else {
  u.rate = rate;
  u.pitch = 0.95;
}

  const voice = pickBestVoice(voices, safeLang);
  if (voice) {
    u.voice = voice;
  }

  setTimeout(() => {
    synth.speak(u);
  }, 60);
}

