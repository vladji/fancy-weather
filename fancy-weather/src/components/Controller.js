import Model from './Model';

export default class Controller {
  constructor(layout) {
    this.interface = layout;
    this.model = new Model();
    this.switchLangBtn = document.querySelector('.btn-controls_lang');
    this.listeners();
  }

  start() {
    const weatherData = this.model.testGetData();
    console.log('contr data', weatherData);
    this.interface.renderApp(weatherData);
  }

  listeners() {
    const langBase = {
      bntSearch: 'Поиск',
      bntLang: 'Ru',
    };

    const switchLang = this.interface.changeLang.bind(this.interface);
    console.log('switchLangBtn', this.switchLangBtn);
    this.switchLangBtn.addEventListener('click', () => {
      switchLang(langBase);
    });
  }
}
