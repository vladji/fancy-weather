export default class Controller {
  constructor(layout, model, speech) {
    this.interface = layout;
    this.model = model;
    this.speechRequest = speech;
    this.controlPanel = document.querySelector('.controls-block');
    this.searchField = document.querySelector('.search-field');
    this.searchBtn = document.querySelector('.btn-search');
    this.store = {};
    this.isOnAir = false;

    const control = this;
    this.handlers = {
      expandLangMenu() {
        layout.langMenuToggle();
      },
      switchLang() {
        const switchableLangs = model.switchLang(control.elem);
        layout.langMenuToggle();
        layout.setBtnLang(switchableLangs, control.elem);
        control.start();
      },
      switchImg() {
        control.setBackground();
      },
      userSearch() {
        control.start();
      },
      switchDeg() {
        const deg = control.elem.dataset.degVal;
        model.checkDeg(deg);
      },
      async userSpeech() {
        if (!control.isOnAir) {
          control.isOnAir = true;
          const result = await speech.speechStart();
          if (result) control.start();
          control.isOnAir = false;
        }
      },
    };

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

    this.interface.setContentLang(this.model.lang);

    if (this.model.lang === 'be') this.interface.setBelLang('be');
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
      if (handler && this.handlers[handler]) {
        this.elem = e.target;
        this.handlers[handler]();
      }
    });

    this.searchField.addEventListener('keyup', (e) => {
      if (e.code === 'Enter' || e.code === 'NumpadEnter') this.start();
    });

    document.body.addEventListener('click', (e) => {
      if (!e.target.closest('.expand-list-wrapper') && this.interface.isLangListExpand) {
        this.interface.langMenuToggle();
      }

      if (e.target.matches('.btn-close-modal')) {
        const errorBlock = e.target.closest('.error-block');
        errorBlock.remove();
      }

      if (e.target.closest('.prevent-show')) {
        const elemPrevent = e.target.closest('.prevent-show');
        this.model.preventErrorShow = elemPrevent.firstChild.checked;
      }
    });
  }
}
