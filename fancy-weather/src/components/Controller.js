export default class Controller {
  constructor(layout, model, speech) {
    this.interface = layout;
    this.model = model;
    this.speechRequest = speech;
    this.controlPanel = document.querySelector('.controls-block');
    this.searchField = document.querySelector('.search-field');
    this.searchBtn = document.querySelector('.btn-search');
    this.store = {};
    this.eventListener();
  }

  initStorage() {
    const mode = this.model;

    if (localStorage.getItem('weather-guess')) {
      const store = JSON.parse(localStorage.getItem('weather-guess'));

      mode.tempDeg = store.degree;

      const targetBtn = document.querySelector(`[data-lang-val="${store.lang}"]`);
      const switchableLangs = mode.switchLang(targetBtn);
      this.interface.setBtnLang(switchableLangs, targetBtn);
    }

    window.addEventListener('beforeunload', () => {
      this.store.lang = mode.lang;
      this.store.degree = mode.tempDeg;
      const store = JSON.stringify(this.store);
      localStorage.setItem('weather-guess', store);
    });

    this.start();
  }

  async start() {
    const query = this.checkQuery();

    if (query) {
      await this.model.getGeoData(query);
    } else {
      await this.model.getCurrentLocationIP();
    }
    this.contentPrepare();
  }

  async contentPrepare() {
    const weatherData = await this.model.getWeatherData();
    this.interface.mainContentRender(weatherData);
    this.setBackground();

    const langObj = this.model.getLang();
    this.interface.setContentLang(langObj);

    if (this.model.lang === 'be') this.interface.setBelLang(langObj);
    if (this.model.tempDeg === 'fahrenheit') this.interface.switchDeg('fahrenheit');
    this.speechRequest.recognition.lang = this.model.lang;

    this.model.clockInit(this.interface);
    this.model.initMap();
  }

  async setBackground() {
    const imgUrl = await this.model.getPhotoData();
    this.interface.insertBackground(imgUrl);
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

    document.body.addEventListener('click', (e) => {
      if (!e.target.closest('.expand-list-wrapper') && this.interface.isLangListExpand) {
        this.interface.langMenuToggle();
      }
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
    const speech = this.speechRequest;

    const handlers = {
      expandLangMenu() {
        view.langMenuToggle();
      },
      switchLang() {
        const switchableLangs = mode.switchLang(elem);
        view.langMenuToggle();
        view.setBtnLang(switchableLangs, elem);
        control.start();
      },
      switchImg() {
        control.setBackground();
      },
      userSearch() {
        control.start();
      },
      switchDeg() {
        const deg = elem.dataset.degVal;
        mode.checkDeg(deg);
      },
      async userSpeech() {
        await speech.speechStart();
        control.start();
      },
    };

    if (handlers[action]) handlers[action]();
  }
}
