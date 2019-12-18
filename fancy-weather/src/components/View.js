import Controller from './Controller';

export default class Layout {
  constructor(skycons) {
    this.icons = skycons(this);
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
    this.elementBel = null;
    this.elementTemperature = null;

    this.isLangListExpand = false;
  }

  static initApp() {
    const mapCSS = document.createElement('link');
    mapCSS.href = 'https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.0/mapbox-gl.css';
    mapCSS.rel = 'stylesheet';

    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, initial-scale=1.0';

    const metaCompatible = document.createElement('meta');
    metaCompatible.httpEquiv = 'X-UA-Compatible';
    metaCompatible.content = 'ie=edge';

    document.head.append(metaViewport, metaCompatible, mapCSS);
  }

  controlsRender() {
    const markup = `
        <div class="control-bnt-wrap">
          <button class="btn-controls btn-controls_image" data-action="switchImg"></button>
          <div class="expand-list-wrapper">
            <button class="btn-controls btn-controls_lang" data-action="expandLangMenu">en</button>
            <div class="expand-list-container">
              <ul class="lang-list">
                <li data-lang-val="be" data-action="switchLang">by</li>
                <li data-lang-val="ru" data-action="switchLang">ru</li>
              </ul>
            </div>
          </div>
          <button class="btn-controls btn-controls_temp-f" data-deg-val="fahrenheit" data-action="switchDeg">&deg; f</button>
          <button class="btn-controls btn-controls_temp-c active-deg" data-deg-val="celsius" data-action="switchDeg">&deg; c</button>
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
          <div class="content__date">
            <p class="content__day">
              <span data-bel="${weatherData.weekDayENshort}">${today.weekday}</span>
              &nbsp;${today.day}&nbsp;
              <span data-bel="${weatherData.monthEN}">${today.month}</span>
            </p>
            <p>
              <span class="content__clock">${today.time}</span>
            </p>
          </div>
          <div class="today flex-block">
            <div class="today__inner flex-block">
              <div class="today__temperature flex-block">
                <div class="digit-big" data-temp>${today.temperature}</div>
                <div class="deg-average">&deg;</div>
              </div>
              <div class="today__icon-wrapper">
                <canvas class="today__icon-weather" width="128" height="128"></canvas>
              </div>
            </div>
            <ul class="today__details-wrap">
              <li class="today__details">${today.summary}</li>
              <li class="today__details"><span data-lang="todayFeels"></span><span data-temp>${today.apparentTemperature}</span><span>&nbsp;&deg;</span></li>
              <li class="today__details"><span data-lang="todayWind"></span><span>&nbsp;${today.windSpeed}&nbsp;m/s</span></li>
              <li class="today__details"><span data-lang="todayHumidity"></span><span>&nbsp;${today.humidity}%</span></li>
            </ul>
          </div>
          <div class="daily flex-block"></div>
        </div>
        <aside class="map-wrapper">
          <div id="map"></div>
          <p class="map-coords"><span class="txt-bold-600">Latitude:&nbsp;</span>${weatherData.latitude}</p>
          <p class="map-coords"><span class="txt-bold-600">Longtitude:&nbsp;</span>${weatherData.longtitude}</p>
        </aside>
    `;
    this.main.innerHTML = markup;

    const iconWeatherTodayElem = document.querySelector('.today__icon-weather');
    this.insertWeatherIcon(iconWeatherTodayElem, today.icon);

    const dailyWeatherBlock = document.querySelector('.daily');

    for (let i = 0; i < daily.length; i += 1) {
      const dailyItem = document.createElement('div');
      dailyItem.classList.add('daily__item');

      const dailyItemMarkup = `
          <p class="daily__item-title" data-bel="${daily[i].weekDayEN}">${daily[i].weekDay}</p>
          <div class="flex-block">
            <p class="daily__item-temperature digit-big"><span data-temp>${daily[i].averageTemperature}</span>&deg;</p>
            <div class="daily__item-icon-wrapper">
              <canvas class="daily__icon-weather-${i} daily__icon-weather_size" width="64" height="64"></canvas>
            </div>
          </div>
      `;
      dailyItem.innerHTML = dailyItemMarkup;
      dailyWeatherBlock.append(dailyItem);

      const iconWeatherDailyElem = document.querySelector(`.daily__icon-weather-${i}`);
      this.insertWeatherIcon(iconWeatherDailyElem, daily[i].icon);
    }

    this.clock = document.querySelector('.content__clock');
    this.langDependElements = document.querySelectorAll('[data-lang]');
    this.elementBel = document.querySelectorAll('[data-bel]');
    this.elementTemperature = document.querySelectorAll('[data-temp]');
  }

  insertWeatherIcon(elem, icon) {
    const { icons, Skycons } = this.icons;
    const iconName = icon.toUpperCase().replace(/-/g, '_');
    icons.add(elem, Skycons[iconName]);
    icons.play();
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
  }

  setBelLang(belLang) {
    const element = this.elementBel;

    for (let i = 0; i < element.length; i += 1) {
      const prop = element[i].dataset.bel;
      let value = belLang.belDate[prop];
      value = value[0].toUpperCase() + value.slice(1);
      element[i].innerHTML = value;
    }
  }

  setBtnLang(buttonsLang, elem) {
    const targetBtn = elem;
    this.langBtn.innerHTML = buttonsLang.targetLang;
    targetBtn.innerHTML = buttonsLang.currentLang;
    targetBtn.dataset.langVal = buttonsLang.currentLang;
  }

  switchDeg(deg) {
    const activeElem = document.querySelector('.active-deg');
    activeElem.classList.remove('active-deg');
    const targetElem = document.querySelector(`[data-deg-val="${deg}"]`);
    targetElem.classList.add('active-deg');

    const toCelsius = (val) => {
      let convVal = val;
      convVal = Math.round((convVal - 32) * 0.5555);
      return convVal;
    };

    const toFahrenheit = (val) => {
      let convVal = val;
      convVal = Math.round(val * 1.8 + 32);
      return convVal;
    };

    const tempElem = this.elementTemperature;
    const convertFunc = (deg === 'fahrenheit') ? toFahrenheit : toCelsius;

    for (let i = 0; i < tempElem.length; i += 1) {
      const val = tempElem[i].innerHTML;
      const convertVal = convertFunc(val);
      tempElem[i].innerHTML = convertVal;
    }
  }

  errorRender(message) {
    this.errorWrap.innerHTML = message;
    document.body.append(this.errorWrap);
    Controller.errorEvent(this.errorWrap);
  }
}
