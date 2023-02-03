import { useState, useEffect } from "react";
import Weather from "./Weather";
import cities from "./cities.json";
import logo from "./assets/weatherIcon.svg";
import "./App.scss";

function App() {
  const [cityCodes, setCityCodes] = useState([]);
  const API_KEY = "bb28004717ff69635c9fd329b739e04c";
  const units = "metric";
  /* useEffect(() => {
    fetch("./data/cities.json")
      .then((response) => response.json())
      .then((cities) => {
        const codes = cities.List.map((city) => city.code);
        setCityCodes(codes);
      });
  }, []); */
  useEffect(() => {
    const codes = cities.List.map((city) => city.CityCode);
    setCityCodes(codes);
  }, []);

  return (
    <>
      <div className="title">
        <div>
          <img src={logo} alt="icon" />
        </div>
        <div>
          <h2>Weather App</h2>
        </div>
      </div>

      <div className="parent">
        {cityCodes.map((cityCode, index) => (
          <Weather
            index={index}
            key={cityCode}
            cityCode={cityCode}
            units={units}
            api={API_KEY}
          />
        ))}
      </div>

      <div className="footer">
        <p>💚 Coded with passion 💚</p>
      </div>
    </>
  );
}

export default App;
