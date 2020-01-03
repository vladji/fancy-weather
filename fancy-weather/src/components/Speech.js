export default class Speech {
  constructor(layout) {
    this.interface = layout;
    this.recognition = new (window.SpeechRecognition
      || window.webkitSpeechRecognition || window.mozSpeechRecognition
      || window.msSpeechRecognition)();
    this.recognition.interimResults = true;
    this.recognition.lang = 'en';

    this.recognition.addEventListener('result', (e) => {
      this.transcript = Array.from(e.results)
        .map((item) => item[0].transcript);
    });
  }

  speechStart() {
    this.transcript = null;
    return new Promise((resolve) => {
      this.interface.aniamtionMicrophone();
      this.recognition.start();

      this.recognition.addEventListener('end', () => {
        if (this.transcript) {
          this.interface.insertSpeechRequest(this.transcript);
        }
        this.interface.aniamtionMicrophone();
        resolve(this.transcript);
      }, { once: true });
    });
  }
}
