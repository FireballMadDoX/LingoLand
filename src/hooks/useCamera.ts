import { useCallback, useEffect, useRef, useState } from 'react';

export type CameraStatus = 'idle' | 'requesting' | 'ready' | 'denied' | 'error';

export interface UseCameraResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  status: CameraStatus;
  errorMessage: string | null;
  retry: () => void;
}

const REAR_CONSTRAINTS: MediaStreamConstraints = {
  video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
  audio: false,
};

const FRONT_CONSTRAINTS: MediaStreamConstraints = {
  video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
  audio: false,
};

export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const stopStream = useCallback(() => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const requestStream = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('error');
        setErrorMessage('Camera is not supported on this device.');
        return;
      }

      setStatus('requesting');
      setErrorMessage(null);

      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia(REAR_CONSTRAINTS);
      } catch (rearErr) {
        if (rearErr instanceof DOMException && rearErr.name === 'NotAllowedError') {
          if (!cancelled) {
            setStatus('denied');
            setErrorMessage('We need camera permission to scan objects.');
          }
          return;
        }
        try {
          stream = await navigator.mediaDevices.getUserMedia(FRONT_CONSTRAINTS);
        } catch (frontErr) {
          if (!cancelled) {
            if (frontErr instanceof DOMException && frontErr.name === 'NotAllowedError') {
              setStatus('denied');
              setErrorMessage('We need camera permission to scan objects.');
            } else {
              setStatus('error');
              setErrorMessage('Could not start the camera. Please try again.');
            }
          }
          return;
        }
      }

      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        try {
          await video.play();
        } catch {
          // Autoplay can fail until a user gesture; the element still renders frames once played.
        }
      }
      setStatus('ready');
    };

    requestStream();

    return () => {
      cancelled = true;
      stopStream();
    };
  }, [attempt, stopStream]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { videoRef, status, errorMessage, retry };
}
