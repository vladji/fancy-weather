const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

const langBase = {
  en: {
    bntSearch: 'search',
    todayFeels: 'feels like:',
    todayWind: 'wind:',
    todayHumidity: 'humidity:',
    searchPlaceholder: 'Type place please',
  },
  ru: {
    bntSearch: 'поиск',
    todayFeels: 'ощущается как:',
    todayWind: 'скорость ветра:',
    todayHumidity: 'влажность:',
    searchPlaceholder: 'Введите место',
  },
  be: {
    bntSearch: 'пошук',
    todayFeels: 'адчуваецца як:',
    todayWind: 'хуткасць ветру:',
    todayHumidity: 'вільготнасць:',
    searchPlaceholder: 'Увядзіце месца',
    belDate: {
      mon: 'пнд', tue: 'аўт', wed: 'сер', thu: 'чцв', fri: 'пят', sat: 'суб', sun: 'няд', monday: 'панядзелак', tuesday: 'аўторак', wednesday: 'серада', thursday: 'чацьвер', friday: 'пятніца', saturday: 'субота', sunday: 'нядзеля', january: 'студзень', february: 'люты', march: 'сакавік', april: 'красавік', may: 'травень', june: 'чэрвень', july: 'ліпень', august: 'жнівень', september: 'верасень', october: 'кастрычнік', november: 'лістапад', december: 'снежань',
    },
  },
};

export default class Model {
  constructor(layout) {
    this.interface = layout;
    this.ipApi = 'https://ipinfo.io/json?token=8d3889f93dad62';
    this.weatherApi = 'https://api.darksky.net/forecast/987251c0ee515463cce9f694cf4913ad/';
    this.geoLocationApi = 'https://api.opencagedata.com/geocode/v1/json?key=5664a8feeeba4d4e8b5539b7302c030b&limit=1&q=';
    this.weatherApiUnits = 'si';
    this.wetherApiExclude = 'minutely,hourly,alerts';
    this.lang = 'en';
    this.tempDeg = 'celsius';
    this.location = null;
    this.latitude = null;
    this.longtitude = null;
    this.country = null;
    this.city = null;
    this.offsetSec = null;
    this.dateUNIX = null;
    this.weekday = null;
    this.day = null;
    this.month = null;
    this.time = null;
    this.isUserRequest = false;
    this.TIME_CONST = 60; // seconds in min & min in hour
    this.MS_IN_SEC = 1000;
    this.MS_IN_MIN = 60000;
  }

  checkDeg(deg) {
    if (deg !== this.tempDeg) this.interface.switchDeg(deg);
    this.tempDeg = deg;
  }

  getLang() {
    const langObj = langBase[this.lang];
    return langObj;
  }

  switchLang(targetBtn) {
    const targetLang = targetBtn.dataset.langVal;
    const currentLang = this.lang;
    this.lang = targetLang;
    return { targetLang, currentLang };
  }

  async getCurrentLocationIP() {
    let requestApi = null;
    let location = null;

    if (!this.isUserRequest) {
      requestApi = await fetch(this.ipApi);
      location = await requestApi.json();
    }
    const { loc } = location;
    await this.getGeoData(loc);
  }

  async getGeoData(query) {
    try {
      const url = `${this.geoLocationApi}${query}&language=${this.lang}`;
      const response = await fetch(url);
      const data = await response.json();

      this.country = data.results[0].components.country;
      this.city = data.results[0].components.city
        || data.results[0].components.county || data.results[0].components.state;

      this.offsetSec = data.results[0].annotations.timezone.offset_sec;

      const latitude = data.results[0].geometry.lat.toFixed(4);
      const longtitude = data.results[0].geometry.lng.toFixed(4);

      this.latitude = +latitude;
      this.longtitude = +longtitude;
      this.location = `${latitude},${longtitude}`;
    } catch (err) {
      this.interface.errorRender('Please try again, and make sure, that your query is correct.');
    }
  }

  getDate() {
    const deviceTimeStamp = Date.now();
    const timeZoneOffsetInSec = new Date().getTimezoneOffset() * this.TIME_CONST;

    const dateUnixUTC = (deviceTimeStamp / this.MS_IN_SEC) + timeZoneOffsetInSec;
    const targetDateUNIX = dateUnixUTC + this.offsetSec;
    this.dateUNIX = targetDateUNIX;

    const targetDate = new Date(targetDateUNIX * this.MS_IN_SEC);

    const weekday = targetDate.toLocaleString(this.lang, { weekday: 'short' });
    const weekdayEN = targetDate.toLocaleString('en', { weekday: 'short' });

    const day = targetDate.toLocaleString(this.lang, { day: '2-digit' });

    const month = targetDate.toLocaleString(this.lang, { month: 'long' });
    const monthEN = targetDate.toLocaleString('en', { month: 'long' });

    const time = targetDate.toLocaleString(this.lang, { hour: '2-digit', minute: '2-digit' });

    this.weekday = weekday[0].toUpperCase() + weekday.slice(1);
    this.weekDayEN = weekdayEN.toLowerCase();
    this.month = month[0].toUpperCase() + month.slice(1);
    this.monthEN = monthEN.toLowerCase();
    this.day = day;
    this.time = time;
  }

  getWeatherData() {
    this.getDate();

    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    const weatherData = fetch(`
      ${PROXY_URL}${this.weatherApi}${this.location}?exclude=${this.wetherApiExclude}&units=${this.weatherApiUnits}&lang=${this.lang}&time=${this.dateUNIX}
      `)
      .then((response) => response.json())
      .then((rawData) => this.contentComposition(rawData));
    return weatherData;
  }

  contentComposition(rawData) {
    const temperature = Math.round(rawData.currently.temperature);
    const apparentTemperature = Math.round(rawData.currently.apparentTemperature);
    const windSpeed = Math.round(rawData.currently.windSpeed);
    const humidity = Math.round(+rawData.currently.humidity * 100);
    const daily = rawData.daily.data.slice(1, 4);
    const transformDaily = this.transformDaily(daily);

    const renderData = {
      dataToday: {
        temperature,
        apparentTemperature,
        windSpeed,
        humidity,
        country: this.country,
        city: this.city,
        weekday: this.weekday,
        day: this.day,
        month: this.month,
        time: this.time,
        currenTime: rawData.currently.time,
        summary: rawData.currently.summary,
        icon: rawData.currently.icon,
      },
      dataDaily: transformDaily,
      weekDayENshort: this.weekDayEN,
      monthEN: this.monthEN,
      latitude: this.latitude,
      longtitude: this.longtitude,
    };

    console.log('renderData', renderData);
    return renderData;
  }

  transformDaily(data) {
    const daily = data;

    for (let i = 0; i < daily.length; i += 1) {
      const { time, temperatureHigh, temperatureLow } = daily[i];

      const targetTimeStamp = (time + this.offsetSec) * this.MS_IN_SEC;
      const weekDay = new Date(targetTimeStamp);

      const weekDayEN = weekDay.toLocaleString('en', { weekday: 'long' });
      daily[i].weekDayEN = weekDayEN.toLowerCase();

      const weekDayLong = weekDay.toLocaleString(this.lang, { weekday: 'long' });
      daily[i].weekDay = weekDayLong;

      const averageTemperature = Math.round((temperatureHigh + temperatureLow) / 2);
      daily[i].averageTemperature = averageTemperature;
    }
    return daily;
  }

  clockInit(view) {
    const setTime = () => {
      this.getDate();
      view.clockRender(this.time);
    };

    const millisecondsRemain = (this.TIME_CONST - new Date().getSeconds()) * this.MS_IN_SEC;
    setTimeout(() => {
      setTime();
      setInterval(() => {
        setTime();
      }, this.MS_IN_MIN);
    }, millisecondsRemain);
  }

  initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoidmxhZGppIiwiYSI6ImNrNDFvdG80NzAzYWkza3J3dDQ3NWk0dGYifQ.DXV2tPqWjUiaS3-cGqim2g';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.longtitude, this.latitude],
      zoom: 9,
    });
    return map;
  }
}
