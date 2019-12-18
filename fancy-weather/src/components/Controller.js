export default class Controller {
  constructor(layout, model) {
    this.interface = layout;
    this.model = model;
    this.controlPanel = document.querySelector('.controls-block');
    this.searchField = document.querySelector('.search-field');
    this.searchBtn = document.querySelector('.btn-search');
    this.eventListener();
  }

  async start() {
    try {
      const query = this.checkQuery();

      if (query) {
        await this.model.getGeoData(query);
      } else {
        await this.model.getCurrentLocationIP();
      }
      this.contentPrepare();
      console.log(this.searchBtn);
    } catch (err) {
      this.interface.errorRender('Ooopss... Something went wrong. Perhaps it has to do with the definition IP or GEO query');
    }
  }

  async contentPrepare() {
    try {
      const weatherData = await this.model.getWeatherData();
      this.interface.mainContentRender(weatherData);

      const langObj = this.model.getLang();
      this.interface.setContentLang(langObj);

      if (this.model.lang === 'be') this.interface.setBelLang(langObj);
      if (this.model.tempDeg === 'fahrenheit') this.interface.switchDeg('fahrenheit');

      this.model.clockInit(this.interface);
      this.model.initMap();
    } catch (err) {
      this.interface.errorRender('Ooopss... Something went wrong. Perhaps it has to do with weather server');
    }
  }

  checkQuery() {
    let query = this.searchField.value.trim();
    query = query.replace(/\s+/g, ' ');
    return query;
  }

  eventListener() {
    this.controlPanel.addEventListener('click', (e) => {
      const handler = e.target.dataset.action;
      if (handler) this.handlerEvent(handler, e.target);
    });

    this.searchField.addEventListener('keyup', (e) => {
      if (e.code === 'Enter' || e.code === 'NumpadEnter') this.start();
    });
  }

  static errorEvent(errorElem) {
    document.addEventListener('click', (e) => {
      if (e.target !== errorElem) {
        errorElem.remove();
      }
    }, { once: true });
  }

  handlerEvent(action, elem) {
    const control = this;
    const view = this.interface;
    const mode = this.model;

    const handlers = {
      expandLangMenu() {
        view.langMenuToggle();
      },
      switchLang() {
        const buttonsLang = mode.switchLang(elem);
        view.langMenuToggle();
        view.setBtnLang(buttonsLang, elem);
        control.start();
      },
      userSearch() {
        control.start();
      },
      switchDeg() {
        const deg = elem.dataset.degVal;
        mode.checkDeg(deg);
      },
    };

    if (handlers[action]) handlers[action]();
  }
}
