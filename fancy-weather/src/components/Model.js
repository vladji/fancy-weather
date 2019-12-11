const testData = {
  latitude: 53.9,
  longitude: 27.5667,
  timezone: 'Europe/Minsk',
  currently: {
    time: 1575401440,
    summary: 'Mostly Cloudy',
    icon: 'partly-cloudy-day',
    precipIntensity: 0.0031,
    precipProbability: 0.03,
    precipType: 'snow',
    precipAccumulation: 0.0334,
    temperature: 29.99,
    apparentTemperature: 22.53,
    dewPoint: 26.97,
    humidity: 0.88,
    pressure: 1020.6,
    windSpeed: 7.78,
    windGust: 22.91,
    windBearing: 111,
    cloudCover: 0.72,
    uvIndex: 0,
    visibility: 6.38,
    ozone: 271,
  },
  daily: {
    summary: 'Mixed precipitation throughout the week.',
    icon: 'sleet',
    data: [
      {
        time: 1575320400, icon: 'snow', temperatureHigh: 30.89, temperatureLow: 20.86,
      },
      {
        time: 1575406800, icon: 'cloudy', temperatureHigh: 35.99, temperatureLow: 20.86,
      },
      {
        time: 1575493200, icon: 'cloudy', temperatureHigh: 34.88, temperatureLow: 20.86,
      },
      {
        time: 1575320400, icon: 'snow', temperatureHigh: 30.89, temperatureLow: 20.86,
      },
      {
        time: 1575493200, summary: 'del', temperatureHigh: 34.88,
      },
    ],
  },
  flags: {
    'meteoalarm-license': 'Based on data from EUMETNET - MeteoAlarm [https://www.meteoalarm.eu/]. Time delays between this website and the MeteoAlarm website are possible; for the most up to date information about alert levels as published by the participating National Meteorological Services please use the MeteoAlarm website.',
  },
};
console.log('test', testData);

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
    this.country = null;
    this.city = null;
    this.offsetSec = null;
    this.isUserRequest = false;
  }

  testGetData() {
    console.log(this.lang);
    const renderData = this.parseData(testData);
    return renderData;
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
    this.location = `${latitude},${longtitude}`;
  }

  getWeatherData() {
    const deviceDate = new Date();
    const dateISO = deviceDate.toISOString().slice(0, 19);
    console.log('dateNowISO', dateISO);

    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    const weatherData = fetch(`
    ${PROXY_URL}${this.weatherApi}${this.location}?exclude=${this.wetherApiExclude}&units=${this.weatherApiUnits}&lang=${this.lang}
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

      const timeStampInMs = time * 1000;
      let weekDay = new Date(timeStampInMs);
      weekDay = weekDay.toLocaleString(this.lang, { weekday: 'long' });
      daily[i].weekDay = weekDay;

      const averageTemperature = Math.round((temperatureHigh + temperatureLow) / 2);
      daily[i].averageTemperature = averageTemperature;
    }

    return daily;
  }
}
