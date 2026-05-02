import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Volume2 } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';
import { useObjectDetection, type DetectedObject } from '../../hooks/useObjectDetection';
import { translateLabel, SPEECH_LANG_TAG, type LangCode } from '../../data/objectTranslations';

interface ScannerProps { onBack: () => void; }

const LANG_OPTIONS: { code: LangCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English',  flag: '🇺🇸' },
  { code: 'es', label: 'Spanish',  flag: '🇪🇸' },
  { code: 'zh', label: 'Mandarin', flag: '🇨🇳' },
];

const speak = (text: string, lang: LangCode) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LANG_TAG[lang];
  utterance.rate = 0.9;
  const matchingVoice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(lang));
  if (matchingVoice) utterance.voice = matchingVoice;
  synth.speak(utterance);
};

interface VideoSize { width: number; height: number; }

const Scanner: React.FC<ScannerProps> = ({ onBack }) => {
  const [language, setLanguage] = useState<LangCode>('en');
  const [videoSize, setVideoSize] = useState<VideoSize | null>(null);
  const { videoRef, status: cameraStatus, errorMessage: cameraError, retry } = useCamera();

  const detectionEnabled = cameraStatus === 'ready' && videoSize !== null;
  const { detections, modelStatus } = useObjectDetection(videoRef, {
    enabled: detectionEnabled, minScore: 0.55, fps: 5,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.getVoices();
    return () => window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleMeta = () => {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        setVideoSize({ width: video.videoWidth, height: video.videoHeight });
      }
    };
    video.addEventListener('loadedmetadata', handleMeta);
    return () => video.removeEventListener('loadedmetadata', handleMeta);
  }, [videoRef]);

  const handleBoxTap = useCallback((det: DetectedObject) => {
    const word = translateLabel(det.label, language);
    speak(word, language);
  }, [language]);

  const aspectRatio = useMemo(
    () => (videoSize ? `${videoSize.width} / ${videoSize.height}` : '16 / 9'),
    [videoSize]
  );

  const showModelLoading = cameraStatus === 'ready' && modelStatus === 'loading';

  return (
    <div className="min-h-screen px-4 pb-12 pt-24" style={{ background: 'linear-gradient(160deg, #042F2E 0%, #064E3B 50%, #022C22 100%)' }}>
      <div className="fixed top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: '#10B981' }} />
      <div className="fixed bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: '#14B8A6' }} />

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} onClick={onBack}
          className="flex items-center gap-2 text-emerald-200 hover:text-white font-bold text-sm mb-6 transition-colors">
          <ArrowLeft size={18} /> Back to Games
        </motion.button>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg" style={{ background: 'linear-gradient(135deg, #10B981, #14B8A6)' }}>
            <Camera color="white" size={28} />
          </div>
          <div className="flex-1">
            <h1 className="font-heading font-black text-3xl text-white">Word Scanner</h1>
            <p className="font-body text-emerald-300 text-sm mt-0.5">Point your camera at things to learn their names!</p>
          </div>
        </motion.div>

        <div className="flex gap-2 mb-5 bg-black/30 backdrop-blur-sm p-1.5 rounded-2xl border border-emerald-700/40 w-fit">
          {LANG_OPTIONS.map((opt) => {
            const active = language === opt.code;
            return (
              <button key={opt.code} onClick={() => setLanguage(opt.code)}
                className="px-4 py-2 rounded-xl font-heading font-bold text-sm flex items-center gap-2 transition-colors"
                style={{
                  background: active ? 'linear-gradient(135deg, #10B981, #14B8A6)' : 'transparent',
                  color: active ? 'white' : '#A7F3D0',
                  boxShadow: active ? '0 6px 20px rgba(16,185,129,0.35)' : 'none',
                }}>
                <span className="text-lg leading-none">{opt.flag}</span>
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full overflow-hidden rounded-3xl bg-black border-2 border-emerald-700/40"
          style={{ aspectRatio, boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>
          <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" />

          {videoSize && cameraStatus === 'ready' && (
            <div className="absolute inset-0 pointer-events-none">
              {detections.map((det, i) => {
                const [bx, by, bw, bh] = det.bbox;
                const left = (bx / videoSize.width) * 100;
                const top = (by / videoSize.height) * 100;
                const width = (bw / videoSize.width) * 100;
                const height = (bh / videoSize.height) * 100;
                const word = translateLabel(det.label, language);
                return (
                  <button key={`${det.label}-${i}`} onClick={() => handleBoxTap(det)}
                    className="absolute pointer-events-auto group"
                    style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }}
                    aria-label={`Hear the word ${word}`}>
                    <div className="absolute inset-0 rounded-xl border-[3px] transition-all"
                      style={{ borderColor: '#34D399', boxShadow: '0 0 0 2px rgba(0,0,0,0.25), 0 8px 24px rgba(16,185,129,0.45)', background: 'rgba(16,185,129,0.05)' }} />
                    <span className="absolute -top-9 left-0 px-3 py-1.5 rounded-xl font-heading font-bold text-sm flex items-center gap-1.5 whitespace-nowrap"
                      style={{ background: 'linear-gradient(135deg, #10B981, #14B8A6)', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
                      <Volume2 size={14} />
                      {word}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <AnimatePresence>
            {cameraStatus === 'requesting' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm text-center px-6">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
                  className="w-12 h-12 rounded-full border-4 border-emerald-300 border-t-transparent mb-4" />
                <p className="font-heading font-bold text-white">Starting camera…</p>
              </motion.div>
            )}
            {cameraStatus === 'denied' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm text-center px-6">
                <div className="text-6xl mb-3">📷</div>
                <h2 className="font-heading font-bold text-white text-xl mb-2">Camera permission needed</h2>
                <p className="font-body text-emerald-200 mb-5 max-w-xs">{cameraError ?? 'We need to use your camera so the scanner can find things to name.'}</p>
                <button onClick={retry} className="px-6 py-3 rounded-2xl font-heading font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #10B981, #14B8A6)', boxShadow: '0 8px 0 #047857' }}>
                  Try Again
                </button>
              </motion.div>
            )}
            {cameraStatus === 'error' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm text-center px-6">
                <div className="text-6xl mb-3">😕</div>
                <h2 className="font-heading font-bold text-white text-xl mb-2">Camera couldn't start</h2>
                <p className="font-body text-emerald-200 mb-5 max-w-xs">{cameraError ?? 'Something went wrong.'}</p>
                <button onClick={retry} className="px-6 py-3 rounded-2xl font-heading font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #10B981, #14B8A6)', boxShadow: '0 8px 0 #047857' }}>
                  Try Again
                </button>
              </motion.div>
            )}
            {showModelLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 to-transparent text-center">
                <div className="inline-flex items-center gap-3 bg-emerald-900/80 backdrop-blur-sm px-5 py-3 rounded-2xl border border-emerald-500/40">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                    className="w-5 h-5 rounded-full border-2 border-emerald-300 border-t-transparent" />
                  <span className="font-heading font-bold text-white text-sm">Loading detector… (first-time download, around 27 MB)</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="font-body text-emerald-300/80 text-sm mt-5 text-center">Tap any green box to hear the word out loud!</p>
      </div>
    </div>
  );
};

export default Scanner;
