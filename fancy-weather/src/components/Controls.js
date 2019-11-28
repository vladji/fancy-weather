export default class Controls {
  constructor(layout) {
    this.interface = layout;
    this.ipApi = 'https://ipinfo.io/json?token=8d3889f93dad62';
    this.weatherApi = 'https://api.darksky.net/forecast/987251c0ee515463cce9f694cf4913ad/';
  }

  async requestApi() {
    const requestIp = await fetch(this.ipApi);
    const dataLocation = await requestIp.json();
    console.log(dataLocation);
    const { city, country, loc } = dataLocation;
    console.log(city, country, loc);

    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    fetch(`${PROXY_URL}${this.weatherApi}${loc}`)
      .then((requestWeatherApi) => requestWeatherApi.json())
      .then((dataWeather) => this.interface.renderDataWeather(dataWeather));
  }
}
