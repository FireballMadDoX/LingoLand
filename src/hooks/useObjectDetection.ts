import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export interface DetectedObject {
  label: string;
  score: number;
  bbox: [number, number, number, number];
}

export type ModelStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface UseObjectDetectionOptions {
  enabled: boolean;
  minScore?: number;
  fps?: number;
}

export interface UseObjectDetectionResult {
  detections: DetectedObject[];
  modelStatus: ModelStatus;
  errorMessage: string | null;
}

export function useObjectDetection(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  { enabled, minScore = 0.5, fps = 5 }: UseObjectDetectionOptions
): UseObjectDetectionResult {
  const [detections, setDetections] = useState<DetectedObject[]>([]);
  const [modelStatus, setModelStatus] = useState<ModelStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRunRef = useRef<number>(0);
  const runningRef = useRef<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setModelStatus('loading');
      try {
        await tf.ready();
        const model = await cocoSsd.load();
        if (cancelled) { model.dispose(); return; }
        modelRef.current = model;
        setModelStatus('ready');
      } catch (err) {
        if (!cancelled) {
          setModelStatus('error');
          setErrorMessage(err instanceof Error ? err.message : 'Failed to load detector.');
        }
      }
    };
    load();
    return () => {
      cancelled = true;
      modelRef.current?.dispose();
      modelRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!enabled || modelStatus !== 'ready') return;
    const intervalMs = 1000 / fps;
    const tick = async (ts: number) => {
      if (ts - lastRunRef.current >= intervalMs && !runningRef.current) {
        const video = videoRef.current;
        const model = modelRef.current;
        if (video && model && video.readyState >= 2 && video.videoWidth > 0) {
          runningRef.current = true;
          try {
            const raw = await model.detect(video);
            const filtered: DetectedObject[] = raw
              .filter((p) => p.score >= minScore)
              .map((p) => ({
                label: p.class,
                score: p.score,
                bbox: [p.bbox[0], p.bbox[1], p.bbox[2], p.bbox[3]],
              }));
            setDetections(filtered);
          } catch {
            // transient detector error; next tick will retry
          } finally {
            runningRef.current = false;
            lastRunRef.current = ts;
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      runningRef.current = false;
    };
  }, [enabled, modelStatus, fps, minScore, videoRef]);

  return { detections, modelStatus, errorMessage };
}
