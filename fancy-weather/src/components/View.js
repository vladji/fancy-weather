import Controller from './Controller';

export default class Layout {
  constructor() {
    this.bodyWrapper = document.createElement('div');
    this.bodyWrapper.classList.add('body-wrapper');

    this.header = document.createElement('header');
    this.header.classList.add('controls-block', 'flow-blocks-wrapper');
    this.bodyWrapper.append(this.header);

    this.main = document.createElement('main');
    this.main.classList.add('main-wrapper', 'flow-blocks-wrapper');
    this.bodyWrapper.append(this.main);
    document.body.append(this.bodyWrapper);

    this.errorWrap = document.createElement('div');
    this.errorWrap.classList.add('error-wrapper');

    this.clock = null;
    this.langContainerElem = null;
    this.langList = null;
    this.langBtn = null;
    this.langDependElements = null;
    this.searchField = null;

    this.isLangListExpand = false;
  }

  renderApp(weatherData) {
    const mapCSS = document.createElement('link');
    mapCSS.href = 'https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.0/mapbox-gl.css';
    mapCSS.rel = 'stylesheet';
    document.head.append(mapCSS);

    this.mainContentRender(weatherData);
  }

  controlsRender() {
    const markup = `
        <div class="control-bnt-wrap">
          <button class="btn-controls btn-controls_image" data-action="switchImg"></button>
          <div class="expand-list-wrapper">
            <button class="btn-controls btn-controls_lang" data-action="switchLang">en</button>
            <div class="expand-list-container">
              <ul class="lang-list">
                <li data-lang-val="be" data-action="pickLang">by</li>
                <li data-lang-val="ru" data-action="pickLang">ru</li>
              </ul>
            </div>
          </div>
          <button class="btn-controls btn-controls_temp-f" data-deg-val="fahrenheit" data-action="switchDeg">&deg; f</button>
          <button class="btn-controls btn-controls_temp-c" data-deg-val="celsius" data-action="switchDeg">&deg; c</button>
        </div>
        <div class="control-search-wrap"> 
          <input class="search-field" type="text" placeholder="">
          <button class="btn-controls btn-search" data-lang="bntSearch" data-action="userSearch">search</button>
        </div>
    `;

    this.header.innerHTML = markup;
    this.langContainerElem = document.querySelector('.expand-list-container');
    this.langList = document.querySelector('.lang-list');
    this.langBtn = document.querySelector('.btn-controls_lang');
    this.searchField = document.querySelector('.search-field');
  }

  mainContentRender(weatherData) {
    const today = weatherData.dataToday;
    const daily = weatherData.dataDaily;

    const markup = `
        <div class="content">
          <p class="content__head">${today.city}, ${today.country}</p>
          <p class="content__date"><span data-bel="weekdayShort">${today.weekday}</span>&nbsp;${today.day}&nbsp;<span data-bel="month">${today.month}</span>
              &emsp;<span class="content__clock">${today.time}</span></p>
          <div class="today flex-block">
            <p class="today__temperature flex-block digit-big">${today.temperature}<span class="deg-average">&deg;</span></p>
            <div class="today__details-wrap">
              <div class="today__icon-weather"></div>
              <p class="today__details">${today.summary}</p>
              <p class="today__details"><span data-lang="todayFeels"></span><span>&nbsp;${today.apparentTemperature}&deg;</span></p>
              <p class="today__details"><span data-lang="todayWind"></span><span>&nbsp;${today.windSpeed}&nbsp;m/s</span></p>
              <p class="today__details"><span data-lang="todayHumidity"></span><span>&nbsp;${today.humidity}%</span></p>
            </div>
          </div>
          <div class="daily flex-block"></div>
        </div>
        <aside class="map-wrapper">
          <div id="map"></div>
        </aside>
    `;
    this.main.innerHTML = markup;
    this.clock = document.querySelector('.content__clock');

    const dailyWeatherBlock = document.querySelector('.daily');

    for (let i = 0; i < daily.length; i += 1) {
      const dailyItem = document.createElement('div');
      dailyItem.classList.add('daily__item');

      const dailyItemMarkup = `
          <p class="daily__item-title data-bel="weekdayLong"">${daily[i].weekDay}</p>
          <div class="flex-block">
            <p class="daily__item-temperature digit-big">${daily[i].averageTemperature}&deg;</p>
            <div class="daily__item-icon-weather"></div>
          </div>
      `;
      dailyItem.innerHTML = dailyItemMarkup;
      dailyWeatherBlock.append(dailyItem);
    }

    this.langDependElements = document.querySelectorAll('[data-lang]');
  }

  clockRender(time) {
    this.clock.innerHTML = `${time}`;
  }

  langMenuToggle() {
    if (!this.isLangListExpand) {
      this.langContainerElem.style.height = '100px';
      this.langList.classList.add('show-list');

      this.langList.addEventListener('animationend', () => {
        this.langList.classList.remove('show-list');
        this.langList.style.top = '0';
      }, { once: true });
      this.isLangListExpand = true;
    } else {
      this.langList.classList.add('hide-list');

      this.langList.addEventListener('animationend', () => {
        this.langList.classList.remove('hide-list');
        this.langContainerElem.style.height = '';
        this.langList.style.top = '';
      }, { once: true });
      this.isLangListExpand = false;
    }
  }

  setContentLang(langObj) {
    const elements = this.langDependElements;
    for (let i = 0; i < elements.length; i += 1) {
      const prop = elements[i].dataset.lang;
      const text = langObj[prop];
      elements[i].innerHTML = text;
    }
    this.searchField.placeholder = langObj.searchPlaceholder;
    console.log('langObj', langObj);
  }

  setBelLang(belLang) {
    console.log('test', this.errorWrap);
    console.log('belLang', belLang);
  }

  setBtnLang(buttonsLang, elem) {
    const targetBtn = elem;
    this.langBtn.innerHTML = buttonsLang.targetLang;
    targetBtn.innerHTML = buttonsLang.currentLang;
    targetBtn.dataset.langVal = buttonsLang.currentLang;
  }

  errorRender(message) {
    this.errorWrap.innerHTML = message;
    document.body.append(this.errorWrap);
    Controller.errorEvent(this.errorWrap);
  }
}
