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
        time: 1575320400, icon: 'snow', temperatureHigh: 30.89,
      },
      {
        time: 1575406800, icon: 'cloudy', temperatureHigh: 35.99,
      },
      {
        time: 1575493200, summary: 'Foggy in the morning.', temperatureHigh: 34.88,
      },
      {
        time: 1575406800, icon: 'del', temperatureHigh: 35.99,
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

export default class Model {
  constructor() {
    this.ipApi = 'https://ipinfo.io/json?token=8d3889f93dad62';
    this.weatherApi = 'https://api.darksky.net/forecast/987251c0ee515463cce9f694cf4913ad/';
    this.weatherApiUnits = 'si';
    this.wetherApiExclude = 'minutely,hourly,alerts';
    this.lang = 'en';
    this.tempDegree = 'c';
    // this.getWeatherData();
  }

  testGetData() {
    console.log(this.ipApi);
    const renderData = Model.parseData(testData);
    return renderData;
  }

  static parseData(rawData) {
    const renderData = {
      today: {
        currenTime: rawData.currently.time,
        summary: rawData.currently.summary,
        apparentTemperature: rawData.currently.apparentTemperature,
        windSpeed: rawData.currently.windSpeed,
        humidity: rawData.currently.humidity,
        icon: rawData.currently.icon,
      },
      daily: rawData.daily.data.slice(0, 3),
    };
    return renderData;
  }

  async getWeatherData() {
    const requestIp = await fetch(this.ipApi);
    const dataLocation = await requestIp.json();
    console.log(dataLocation);
    const { city, country, loc } = dataLocation;
    console.log(city, country, loc);

    const dateNow = new Date();
    const dateNowISO = dateNow.toISOString();
    console.log('dateNowISO', dateNowISO);

    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    // console.log('url', `${PROXY_URL}${this.weatherApi}${loc}`);

    fetch(`${PROXY_URL}${this.weatherApi}${loc}`)
      .then((requestWeatherApi) => requestWeatherApi.json())
      .then((weatherData) => console.log('weatherData', weatherData));
    // .then((weatherData) => this.interface.renderDataWeather(weatherData));
  }
}
