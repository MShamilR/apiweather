import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./App.scss";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
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
import back from "./assets/back.svg";
import "./City.scss";

const City = () => {
  const location = useLocation();

  if (location.state === null) {
    return (
      <>
        <p className="notFound">
          <strong>Something</strong>&nbsp;went wrong
        </p>
        <Link to={"/"}>
          <p className="notFound goToHome">Go to Home</p>
        </Link>
      </>
    );
  }
  const { cityCode, index } = location.state;

  console.log(cityCode);
  const [weather, setWeather] = useState({});
  const [sunrise, setSunrise] = useState();
  const [sunset, setSunset] = useState();
  const [dateTime, setDateTime] = useState();
  const [icon, setIcon] = useState();

  const fetchWeather = async () => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?id=${cityCode}&units=metric&appid=bb28004717ff69635c9fd329b739e04c`
    );
    const weatherData = await response.data;
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
  return (
    <div className="cityParent">
      <div className="child">
        <Link to={"/"}>
          <img className="back" src={back} alt="back" />
        </Link>
        <div className="innerFlex">
          <div className={`flexChild innerGrid color-${index}`}>
            <div className="centreData">
              <h1 className={"centreTitle"}>
                {data.name}, {data.sys.country}
              </h1>
              <p className="centreDate">{dateTime}</p>
            </div>
            <div className="topDown">
              <div className="weatherItem">
                <div className="icon weatherIcon">
                  <img src={icon} /* alt={mist} */ />
                </div>
                <span>
                  <p>{data.weather[0].description}</p>
                </span>
              </div>
              <div className="weatherItem two">
                <div>
                  <p className="tempMain">{Math.round(data.main.temp)}°c</p>
                </div>
                <div>
                  <p className="grid grid-6">
                    Temp Min: {Math.round(data.main.temp_min)}°C
                  </p>
                  <p className="grid grid-7">
                    Temp Max: {Math.round(data.main.temp_max)}°C
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="flexChild singleColor">
            <div className="pressureParent">
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
                    {data.wind.speed.toFixed(1)}m/s {data.wind.deg} Degree
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
    </div>
  );
};

export default City;
