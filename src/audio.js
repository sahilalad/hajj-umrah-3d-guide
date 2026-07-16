/**
 * Dua / narration audio helper.
 * Prefers an Arabic speech voice for Arabic text, then transliteration TTS.
 */
export class DuaAudio {
  constructor() {
    this.utterance = null;
  }

  stop() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    this.utterance = null;
  }

  pickVoice(langPrefix) {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    return voices.find((voice) => voice.lang?.toLowerCase().startsWith(langPrefix))
      || voices.find((voice) => voice.lang?.toLowerCase().includes(langPrefix))
      || null;
  }

  speakParts({ arabic, transliteration, meaning, language = 'en' }) {
    this.stop();
    if (!window.speechSynthesis) return false;

    const queue = [];
    if (arabic) {
      queue.push({ text: arabic, lang: 'ar-SA', rate: 0.85 });
    }
    if (transliteration) {
      queue.push({ text: transliteration, lang: 'en-US', rate: 0.92 });
    }
    if (meaning) {
      queue.push({
        text: meaning,
        lang: language === 'gu' ? 'gu-IN' : 'en-US',
        rate: 0.95,
      });
    }
    if (!queue.length) return false;

    const speakNext = (index) => {
      if (index >= queue.length) return;
      const part = queue[index];
      const utterance = new SpeechSynthesisUtterance(part.text);
      utterance.lang = part.lang;
      utterance.rate = part.rate;
      const voice = this.pickVoice(part.lang.slice(0, 2));
      if (voice) utterance.voice = voice;
      utterance.onend = () => speakNext(index + 1);
      this.utterance = utterance;
      window.speechSynthesis.speak(utterance);
    };

    // Some browsers load voices asynchronously.
    if (!window.speechSynthesis.getVoices().length) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        speakNext(0);
      };
    }
    speakNext(0);
    return true;
  }

  speakLocation({ title, intro, tasks, language = 'en' }) {
    this.stop();
    if (!window.speechSynthesis) return false;
    const utterance = new SpeechSynthesisUtterance(
      `${title}. ${intro}. ${(tasks || []).join('. ')}`,
    );
    utterance.lang = language === 'gu' ? 'gu-IN' : 'en-US';
    utterance.rate = 0.95;
    const voice = this.pickVoice(utterance.lang.slice(0, 2));
    if (voice) utterance.voice = voice;
    this.utterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  }
}
