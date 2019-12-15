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
    const query = this.checkQuery();

    if (!query) {
      await this.model.getCurrentLocationIP();
    } else {
      await this.model.getGeoData(query);
    }
    this.contentPrepare();
  }

  async contentPrepare() {
    try {
      const weatherData = await this.model.getWeatherData();
      this.interface.renderApp(weatherData);

      const langObj = this.model.getLang();
      this.interface.setContentLang(langObj);

      if (this.model.lang === 'be') this.interface.setBelLang(langObj);
      if (this.model.tempDeg === 'fahrenheit') this.interface.switchDeg('fahrenheit');

      this.model.clockInit(this.interface);
      this.model.initMap();
    } catch (err) {
      this.interface.errorRender('Ooopss... Something went wrong.');
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
