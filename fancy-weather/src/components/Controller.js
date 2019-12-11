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
    this.searchField = document.querySelector('.search-field');
    this.searchBtn = document.querySelector('.btn-search');
    this.listeners();
  }

  async start() {
    await this.model.getCurrentLocationIP();
    this.contentPrepare();
  }

  async contentPrepare() {
    const weatherData = await this.model.getWeatherData();
    this.interface.renderApp(weatherData);
  }

  listeners() {
    const switchLang = this.interface.changeLang.bind(this.interface);
    this.switchLangBtn.addEventListener('click', () => {
      switchLang(langBase);
    });

    this.searchBtn.addEventListener('click', async () => {
      let query = this.searchField.value.trim();
      query = query.replace(/\s+/g, ' ');

      if (query) {
        await this.model.getGeoData(query);
        this.contentPrepare();
      }
    });
  }
}
