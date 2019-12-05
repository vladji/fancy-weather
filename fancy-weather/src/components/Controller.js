import Model from './Model';

const langBase = {
  bntSearch: 'Поиск',
  bntLang: 'Ru',
};

export default class Controller {
  constructor(layout) {
    this.interface = layout;
    this.model = new Model();
    this.switchLangBtn = document.querySelector('.btn-controls_lang');
    this.listeners();
  }

  async start() {
    const weatherData = await this.model.testGetData();
    this.interface.renderApp(weatherData);
  }

  listeners() {
    const switchLang = this.interface.changeLang.bind(this.interface);
    this.switchLangBtn.addEventListener('click', () => {
      switchLang(langBase);
    });
  }
}
