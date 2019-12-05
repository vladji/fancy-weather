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
    this.weatherApiUnits = 'si';
    this.wetherApiExclude = 'minutely,hourly,alerts';
    this.lang = 'en';
    this.tempDegree = 'c';
    this.isUserRequest = false;
  }

  testGetData() {
    console.log(this.lang);
    const renderData = this.parseData(testData);
    return renderData;
  }

  async getLocation() {
    let requestApi = null;
    let location = null;

    if (!this.isUserRequest) {
      requestApi = await fetch(this.ipApi);
      location = await requestApi.json();
    }
    console.log(location);
    const { loc } = location;
    const weatherData = await this.getWeatherData(loc);
    return weatherData;
  }

  getWeatherData(location) {
    const dateNow = new Date();
    const dateNowISO = dateNow.toISOString();
    console.log('dateNowISO', dateNowISO);

    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    const weatherData = fetch(`
    ${PROXY_URL}${this.weatherApi}${location}?exclude=${this.wetherApiExclude}&units=${this.weatherApiUnits}&lang=${this.lang}
    `)
      .then((requestWeatherApi) => requestWeatherApi.json())
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
    const humidity = +rawData.currently.humidity * 100;
    const daily = rawData.daily.data.slice(1, 4);
    const dailyTransform = this.dailyTransform(daily);

    const renderData = {
      today: {
        temperature,
        apparentTemperature,
        windSpeed,
        humidity,
        currenTime: rawData.currently.time,
        summary: rawData.currently.summary,
        icon: rawData.currently.icon,
      },
      daily: dailyTransform,
    };
    return renderData;
  }

  dailyTransform(data) {
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
