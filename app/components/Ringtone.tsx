"use client";
import { useEffect, useRef } from "react";

export default function AutoplayAudio(props: any) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (props?.open && audioRef.current) {
      audioRef?.current?.play()?.catch((err) => {
        console.log("Autoplay blocked:", err);
      });
    }
  }, [props?.open]);

  return (
    <div>
      <audio ref={audioRef}>
        <source
          src="../assets/twirling-intime-lenovo-k8-note-alarm-tone-41440.mp3"
          type="audio/mpeg"
        />
      </audio>
    </div>
  );
}
