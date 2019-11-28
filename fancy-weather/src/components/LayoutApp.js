export default class Layout {
  constructor() {
    this.doc = document.querySelector('body');
  }

  initial() {
    const clock = document.createElement('div');
    const date = new Date();
    clock.innerHTML = `${date.getHours()}:${date.getMinutes()}`;
    this.doc.append(clock);
  }

  renderDataWeather(data) {
    console.log(this.doc);
    const { currently } = data;
    console.log('time', currently.time);
  }
}
