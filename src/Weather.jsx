import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
/* import { format } from "date-fns"; */
import moment from "moment/moment";
import arrow from "./assets/arrow.svg";
import mist from "./assets/mist.svg";
import cloud from "./assets/cloud.svg";
import snow from "./assets/snow.png";
import clear from "./assets/clear.svg";
import rain from "./assets/rain.svg";
import thunderstorm from "./assets/thunderstorm.png";
import brokenCloud from "./assets/brokenCloud.svg";
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

  /* useEffect(() => {
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
        } catch (error) {
          console.error(error);
        }
      };
      fetchWeather();
    }, [cityCode, units]); */
  const fetchWeather = async () => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?id=${cityCode}&units=${units}&appid=${api}`
    );
    const weatherData = await response.json();
    setWeather(weatherData);
    return weatherData;
  };

  const { isLoading, data, isError, error, isFetching, isSuccess } = useQuery(
    [`${cityCode}-weather-data`],
    fetchWeather
  );

   console.log({ isLoading, isFetching, data, isSuccess });

  useEffect(() => {
    if (data) {
      const timezone = data.timezone;
      const unixDateTime = data.dt;
      const unixSunrise = data.sys.sunrise;
      const unixSunset = data.sys.sunset;
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
      if (data.weather[0].id <= 232) {
        setIcon(thunderstorm);
      } else if (data.weather[0].id <= 531) {
        setIcon(rain);
      } else if (data.weather[0].id <= 622) {
        setIcon(snow);
      } else if (data.weather[0].id <= 781) {
        setIcon(mist);
      } else if (data.weather[0].id === 800) {
        setIcon(clear);
      } else if (data.weather[0].id === 803) {
        setIcon(brokenCloud);
      } else if (data.weather[0].id === 801 || 802 || 804) {
        setIcon(cloud);
      } else {
        setIcon(exclamation);
      }
    }
  }, [weather]);

  if (isLoading) {
    return <h4>Loading Weather...</h4>;
  }

  if (error) {
    return <h1>{error.message}</h1>;
  }

  /* console.log({ isLoading, isFetching, data, isSuccess });
  console.log(data.timezone); */

  return (
    <>
      <div className={`children`}>
        <div className="innerFlex">
          <div className="bgImg">
            <div className={`flexChild innerGrid color-${index}`}>
              <p className={`grid grid-1`}>
                {data.name}, {data.sys.country},
              </p>
              <p className="grid grid-2">{Math.round(data.main.temp)}°c</p>
              <p className="grid grid-3">{dateTime}</p>
              <div className="grid grid-4">
                <div className="icon weatherIcon">
                  <img src={icon} /* alt={mist} */ />
                </div>
                <span>
                  <p>{data.weather[0].description}</p>
                </span>
              </div>
              <p className="grid grid-6">
                Temp Min: {Math.round(data.main.temp_min)}°C
              </p>
              <p className="grid grid-7">
                Temp Max: {Math.round(data.main.temp_max)}°C
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="flexChild singleColor">
            <div>
              <p>
                <b>Pressure: </b> {data.main.pressure}Pa
              </p>
              <p>
                <b>Humidity: </b> {data.main.humidity}%
              </p>
              <p>
                <b>Visibility: </b> {(data.visibility / 1000).toFixed(1)}
                km
              </p>
            </div>
            <div className="windParent">
              <div className="wind">
                <span className="icon">
                  <img src={arrow} alt="arrow" />
                </span>
                <span>
                  <p>
                    {data.wind.speed} m/s {data.wind.deg} Degree
                  </p>
                </span>
              </div>
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
    </>
  );
};

export default Weather;
