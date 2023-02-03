import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import moment from "moment/moment";
import arrow from "./assets/arrow.png";
import mist from "./assets/mist.png";
import cloud from "./assets/cloud.png";
import snow from "./assets/snow.png";
import clear from "./assets/clear.png";
import rain from "./assets/rain.png";
import thunderstorm from "./assets/thunderstorm.png";
import brokenCloud from "./assets/brokenCloud.png";
import exclamation from "./assets/exclamation.png";

const Weather = ({ cityCode, units, api, index }) => {
  const [weather, setWeather] = useState({});
  const [sunrise, setSunrise] = useState();
  const [sunset, setSunset] = useState();
  const [dateTime, setDateTime] = useState();
  const [icon, setIcon] = useState();
  const [city, setCity] = useState();

  /* const handleCity = (event) => {
    setCity(event.target.className);
  }; */

  /*  const datetime = format(new Date(), "h.maaa, LLL d"); */

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?id=${cityCode}&units=${units}&appid=${api}`
        );
        if (!response.ok) {
          throw new Error(`Request failed with status code ${response.status}`);
        }
        const weatherData = await response.json();
        console.log(weatherData);
        setWeather(weatherData);
        /*  */
      } catch (error) {
        console.error(error);
      }
    };
    fetchWeather();
  }, [cityCode, units]);

  useEffect(() => {
    if (weather.name) {
      const timezone = weather.timezone;
      const unixDateTime = weather.dt;
      const unixSunrise = weather.sys.sunrise;
      const unixSunset = weather.sys.sunset;
      const dateTimeData = moment
        .utc(unixDateTime, "X")
        .add(timezone, "seconds")
        .format("h.mma, MMM D");
      const sunriseData = moment
        .utc(unixSunrise, "X")
        .add(timezone, "seconds")
        .format("hh:mm a");
      const sunsetData = moment
        .utc(unixSunset, "X")
        .add(timezone, "seconds")
        .format("hh:mm a");
      setDateTime(dateTimeData);
      setSunrise(sunriseData);
      setSunset(sunsetData);
      if (weather.weather[0].id <= 232) {
        setIcon(thunderstorm);
      } else if (weather.weather[0].id <= 531) {
        setIcon(rain);
      } else if (weather.weather[0].id <= 622) {
        setIcon(snow);
      } else if (weather.weather[0].id <= 781) {
        setIcon(mist);
      } else if (weather.weather[0].id === 800) {
        setIcon(clear);
      } else if (weather.weather[0].id === 803) {
        setIcon(brokenCloud);
      } else if (weather.weather[0].id === 801 || 802 || 804) {
        setIcon(cloud);
      } else {
        setIcon(exclamation);
      }
    }
    /* switch (weather.weather[0].id) {
      case value:
        
        break;
    
      default:
        break;
    } */
  }, [weather]);

  return (
    <>
      {weather.name && (
        <div className={`children`}>
          <div className="innerFlex">
            <div className="bgImg">
              <div className={`flexChild innerGrid color-${index}`}>
                <p className={`grid grid-1`}>
                  {weather.name}, {weather.sys.country}, {city}
                </p>
                <p className="grid grid-2">{Math.round(weather.main.temp)}°c</p>
                <p className="grid grid-3">{dateTime}</p>
                <p className="grid grid-4">
                  <div className="icon weatherIcon">
                    <img src={icon} /* alt={mist} */ />
                  </div>
                  <span>{weather.weather[0].description}</span>
                </p>
                <p className="grid grid-6">
                  Temp Min: {Math.round(weather.main.temp_min)}°C
                </p>
                <p className="grid grid-7">
                  Temp Max: {Math.round(weather.main.temp_max)}°C
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="flexChild singleColor">
              <div>
                <p>
                  <b>Pressure: </b> {weather.main.pressure}Pa
                </p>
                <p>
                  <b>Humidity: </b> {weather.main.humidity}%
                </p>
                <p>
                  <b>Visibility: </b> {(weather.visibility / 1000).toFixed(1)}km
                </p>
              </div>
              <div className="windParent">
                <p className="wind">
                  <span className="icon">
                    <img src={arrow} alt="arrow" />
                  </span>
                  <span>
                    {weather.wind.speed} m/s {weather.wind.deg} Degree
                  </span>
                </p>
              </div>
              <div className="sunParent">
                <p>
                  <b>Sunrise: </b>
                  {sunrise}
                </p>
                <p>
                  <b>Sunset: </b>
                  {sunset}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Weather;
