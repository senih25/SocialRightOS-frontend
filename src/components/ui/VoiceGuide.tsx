"use client";

// Pencere API'si kullandığı için zorunlu olarak istemci bileşeni.
// Sesli okuma başlayınca buton durumu değişir; erişilebilir aria-pressed ile bildirilir.
import { useCallback, useState } from "react";

interface VoiceGuideProps {
  text: string;
  label?: string;
}

export default function VoiceGuide({
  text,
  label = "Sayfayı sesli dinle",
}: VoiceGuideProps) {
  const [speaking, setSpeaking] = useState(false);

  const toggle = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "tr-TR";
    utter.rate = 0.9;
    utter.pitch = 1;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, [text, speaking]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={speaking ? "Seslendirmeyi durdur" : label}
      aria-pressed={speaking}
      className="voice-guide-btn"
    >
      <span aria-hidden="true">{speaking ? "⏹" : "🔊"}</span>
      <span>{speaking ? "Durdur" : "Sesli Rehber"}</span>
    </button>
  );
}
