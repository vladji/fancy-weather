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
    console.log('t1', this.transcript);
    return new Promise((resolve) => {
      console.log('t2', this.transcript);
      this.recognition.start();
      this.recognition.addEventListener('end', () => {
        this.interface.insertSpeechRequest(this.transcript);
        resolve();
      }, { once: true });
    });
  }
}
