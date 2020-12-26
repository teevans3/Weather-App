import React, { Component } from "react";
import Weather from "../../components/Weather/Weather";
import Error from '../../components/Errors/Error';
import axios from "axios";
import classes from './Search.module.css';
import dotenv from 'dotenv';

dotenv.config();

// API key from https://developer.accuweather.com/ (only 50 requests per day);
const API_KEY = process.env.REACT_APP_API_KEY;

console.log(API_KEY);

function convertNumTwoDigits(num) {
  return (num < 10) ? '0' + num.toString() : num.toString();
}

class Search extends Component {
  // If local storage is empty, do this... otherwise set to localstorage `values
  state = {
    newUser: true,
    searchInput: "",
    weatherInfo: {
      city: "",
      temperature: "",
      conditions: "",
      isDayTime: null,
      iconURL: ""
    },
    axiosError: false,
    accuError: false,
    inputError: false
  };

  componentDidMount() {
    const pastSearch = localStorage.getItem('city');
    if (pastSearch !== null) {
      this.getWeatherInfo(pastSearch);
      this.setState({newUser: false})
    }
  }

  changeSearchInput = (event) => {
    // Update search state
    this.setState({ searchInput: event.target.value });
  };


  searchForCity = (event) => {
    // Preven form submission
    event.preventDefault();
    // For some reason, event.target.value is not extracting value.. so we have to use state for search input
    this.getWeatherInfo(this.state.searchInput);
  };

  getWeatherInfo = (city) => {
    // Search for city weather info based on search input with weather api
    axios.get(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${API_KEY}&q=${city}`)
      .then(response => {
        // Ensure a city exists that matches the search
        if (response.data.length < 1) {
          console.log("INPUT ERROR")
          this.setState({
            axiosError: false,
            accuError: false,
            inputError: true
          });
          return;
        }
        // Get location key from first result, use key to get city info
        axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${response.data[0].Key}?apikey=${API_KEY}`)
          .then(res => {

            // Update state with values
            const weatherData = res.data[0];

            // Retrieve icon number for image; convert to its corresponding url form
            const weatherIconNumber = weatherData.WeatherIcon;
            const iconURLNumber = convertNumTwoDigits(weatherIconNumber);

            // ALSO SAVE TO LOCAL STORAGE
            localStorage.setItem('city', city);
            this.setState({
              searchInput: "",
              weatherInfo: {
                city: city.toUpperCase(),
                temperature: weatherData.Temperature.Metric.Value,
                conditions: weatherData.WeatherText,
                isDayTime: weatherData.IsDayTime,
                iconURL: `https://apidev.accuweather.com/developers/Media/Default/WeatherIcons/${iconURLNumber}-s.png`
              },
              axiosError: false,
              accuError: false,
              inputError: false
            })
          })
          .catch(err => {
            console.log("ACCU ERROR")
            console.log(err)
            this.setState({
              axiosError: false,
              accuError: true,
              inputError: false})
          });
      })
      .catch(error => {
        console.log("AXIOS ERROR")
        console.log(error)
        this.setState({
          axiosError: true,
          accuError: false,
          inputError: false,})
      })
  }

  render() {
    let containerBackground = "#f0f0f0";
    let containerFontColor = "black";
    let searchBoxColor = "white";
    let searchBoxFontColor = "black";
    if (this.state.weatherInfo.isDayTime === true) {
      containerBackground = "#C3E7F5";
      containerFontColor = "black";
      searchBoxColor = "#d9f0f9";
      searchBoxFontColor = "black";
    }
    if (this.state.weatherInfo.isDayTime === false) {
      containerBackground = "#161c1f";
      containerFontColor = "white";
      searchBoxColor = "black";
      searchBoxFontColor = "white";
    }

    let cityInfo = <Weather weatherInfoDisplay={this.state.weatherInfo} fontColor={containerFontColor}/>;

    if (this.state.newUser) {
      cityInfo = (
        <div className={classes.newUser}>
          <h3>A simple weather application.</h3>
          <span>Search for a city to get instant data on the weather conditions.</span>
        </div>);
    }
    if (this.state.axiosError) {
      cityInfo = <Error errorType="axios" />;
    }
    if (this.state.accuError) {
      cityInfo = <Error errorType="accu" />;
    }
    if (this.state.inputError) {
      cityInfo = <Error errorType="input" />;
    }

    return (
      <div className={classes.SearchContainer} style={{ backgroundColor: containerBackground}}>
        <form onSubmit={(event) => this.searchForCity(event)}>
          <input
            style={{ backgroundColor: searchBoxColor, color: searchBoxFontColor }}
            type="text"
            onChange={(event) => this.changeSearchInput(event)}
            defaultValue={this.state.searchInput}
            placeholder="Search for a city"
          />
        </form>
        {cityInfo}
      </div>
    );
  }
}

export default Search;
