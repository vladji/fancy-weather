export default class Layout {
  constructor() {
    this.bodyWrapper = document.createElement('div');
    this.bodyWrapper.classList.add('body-wrapper');

    this.header = document.createElement('header');
    this.header.classList.add('controls-block', 'flow-blocks-wrapper');
    this.bodyWrapper.append(this.header);

    this.main = document.createElement('main');
    this.main.classList.add('flow-blocks-wrapper');
    this.bodyWrapper.append(this.main);

    document.body.append(this.bodyWrapper);
  }

  renderApp(weatherData) {
    this.mainContentRender(weatherData);
    // const clock = document.createElement('div');
    // const date = new Date();
    // clock.innerHTML = `${date.getHours()}:${date.getMinutes()}`;
    // bodyWrapper.append(clock);
  }

  controlsRender() {
    const markup = `
        <div class="control-bnt-wrap">
          <button class="btn-controls btn-controls_image"></button>
          <button class="btn-controls btn-controls_lang" data-lang="bntLang">en</button>
          <button class="btn-controls btn-controls_temp-f">&deg; f</button>
          <button class="btn-controls btn-controls_temp-c">&deg; c</button>
        </div>
        <div class="control-search-wrap"> 
          <input type="text" placeholder="Search city">
          <button class="btn-controls btn-search" data-lang="bntSearch">search</button>
        </div>
    `;

    this.header.innerHTML = markup;
  }

  mainContentRender(weatherData) {
    const markup = `
        <div class="content">
          <p class="content__head">MINSK, BELARUS</p>
          <p class="content__date">Mon 28 October</p>
          <div class="today flex-block">
            <p class="today__temperature flex-block digit-big">${weatherData.today.temperature}<span class="deg-average">&deg;</span></p>
            <div class="today__details-wrap">
              <div class="today__icon-weather"></div>
              <p class="today__details">${weatherData.today.summary}</p>
              <p class="today__details">Feels like: ${weatherData.today.apparentTemperature}&deg;</p>
              <p class="today__details">Wind: ${weatherData.today.windSpeed} m/s</p>
              <p class="today__details">Humidity: ${weatherData.today.humidity}%</p>
            </div>
          </div>
          <div class="daily flex-block"></div>
        </div>
    `;
    this.main.innerHTML = markup;

    const dailyWeatherBlock = document.querySelector('.daily');

    for (let i = 0; i < weatherData.daily.length; i += 1) {
      const dailyItem = document.createElement('div');
      dailyItem.classList.add('daily__item');

      // const dailyTemperature = Math.round(weatherData.daily[i].temperatureHigh);
      const dailyItemMarkup = `
          <p class="daily__item-title">${weatherData.daily[i].weekDay}</p>
          <div class="flex-block">
            <p class="daily__item-temperature digit-big">${weatherData.daily[i].averageTemperature}&deg;</p>
            <div class="daily__item-icon-weather"></div>
          </div>
      `;
      dailyItem.innerHTML = dailyItemMarkup;
      dailyWeatherBlock.append(dailyItem);
    }
  }

  changeLang(lang) {
    console.log('lang', lang);
    console.log('body wrapper', this.bodyInner);
    const elements = document.querySelectorAll('[data-lang]');

    for (let i = 0; i < elements.length; i += 1) {
      const prop = elements[i].dataset.lang;
      const text = lang[prop];
      elements[i].innerHTML = text;
    }
  }
}
