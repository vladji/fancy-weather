const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

export default class Model {
  constructor() {
    this.ipApi = 'https://ipinfo.io/json?token=8d3889f93dad62';
    this.weatherApi = 'https://api.darksky.net/forecast/987251c0ee515463cce9f694cf4913ad/';
    this.geoLocationApi = 'https://api.opencagedata.com/geocode/v1/json?key=5664a8feeeba4d4e8b5539b7302c030b&limit=1&q=';
    this.weatherApiUnits = 'si';
    this.wetherApiExclude = 'minutely,hourly,alerts';
    this.lang = 'ru';
    this.tempDegree = 'c';
    this.location = null;
    this.latitude = null;
    this.longtitude = null;
    this.country = null;
    this.city = null;
    this.offsetSec = null;
    this.dateUNIX = null;
    this.day = null;
    this.time = null;
    this.isUserRequest = false;
    this.TIME_CONST = 60; // seconds in min & min in hour
    this.MS_IN_SEC = 1000;
    this.MS_IN_MIN = 60000;
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
    const url = `${this.geoLocationApi}${query}&language=${this.lang}`;
    const response = await fetch(url);
    const data = await response.json();

    console.log('location', data);
    this.country = data.results[0].components.country;
    this.city = data.results[0].components.city
      || data.results[0].components.county || data.results[0].components.state;
    this.offsetSec = data.results[0].annotations.timezone.offset_sec;
    console.log('offsetSec', this.offsetSec);
    const latitude = data.results[0].geometry.lat.toFixed(4);
    const longtitude = data.results[0].geometry.lng.toFixed(4);
    this.latitude = +latitude;
    this.longtitude = +longtitude;
    this.location = `${latitude},${longtitude}`;
    console.log('geo', this.latitude, this.longtitude);
  }

  getDate() {
    const deviceTimeStamp = Date.now();
    const timeZoneOffsetInSec = new Date().getTimezoneOffset() * this.TIME_CONST;

    const dateUnixUTC = (deviceTimeStamp / this.MS_IN_SEC) + timeZoneOffsetInSec;
    const targetDateUNIX = dateUnixUTC + this.offsetSec;
    this.dateUNIX = targetDateUNIX;

    const targetDate = new Date(targetDateUNIX * this.MS_IN_SEC);
    const dayOptions = {
      weekday: 'short', month: 'long', day: '2-digit',
    };
    const timeOptions = {
      hour: '2-digit', minute: '2-digit',
    };
    const day = targetDate.toLocaleString(this.lang, dayOptions);
    const time = targetDate.toLocaleString(this.lang, timeOptions);
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
      .then((rawData) => {
        console.log('rawData', rawData);
        return this.parseData(rawData);
      });
    return weatherData;
  }

  parseData(rawData) {
    const temperature = Math.round(rawData.currently.temperature);
    const apparentTemperature = Math.round(rawData.currently.apparentTemperature);
    const windSpeed = Math.round(rawData.currently.windSpeed);
    const humidity = (+rawData.currently.humidity * 100).toFixed(0);
    const daily = rawData.daily.data.slice(1, 4);
    const transformDaily = this.transformDaily(daily);

    const renderData = {
      today: {
        temperature,
        apparentTemperature,
        windSpeed,
        humidity,
        country: this.country,
        city: this.city,
        day: this.day,
        time: this.time,
        currenTime: rawData.currently.time,
        summary: rawData.currently.summary,
        icon: rawData.currently.icon,
      },
      daily: transformDaily,
    };
    return renderData;
  }

  transformDaily(data) {
    const daily = data;

    for (let i = 0; i < daily.length; i += 1) {
      const { time, temperatureHigh, temperatureLow } = daily[i];

      const targetTimeStamp = (time + this.offsetSec) * this.MS_IN_SEC;
      let weekDay = new Date(targetTimeStamp);
      weekDay = weekDay.toLocaleString(this.lang, { weekday: 'long' });
      daily[i].weekDay = weekDay;

      const averageTemperature = Math.round((temperatureHigh + temperatureLow) / 2);
      daily[i].averageTemperature = averageTemperature;
    }

    return daily;
  }

  clockInit(view) {
    const setTime = () => {
      this.getDate();
      view.clockRender(this.day, this.time);
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
