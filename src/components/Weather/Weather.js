import React from "react";
import classes from './Weather.module.css';

const Weather = (props) => {

  return (
    <div className={classes.WeatherContainer} style={{ color: props.fontColor }}>
      <div className={classes.CityName}>{props.weatherInfoDisplay.city}</div>
      <div className={classes.ContainerLeft}>
        <div className={classes.Temp}><b>{props.weatherInfoDisplay.temperature}</b><sup>°C</sup></div>
      </div>
      <div className={classes.ContainerRight}>
        <div className={classes.Image}><img src={props.weatherInfoDisplay.iconURL} title={props.weatherInfoDisplay.conditions} alt="(need new link)"></img></div>
      </div>
    </div>
  );
};

export default Weather;
