import React, {useState, useEffect} from "react";
import axios from "axios";

function App() {
  const [location, setLocation] = useState(''); 
  const [data, setData] = useState({}); 
  const [isF, setIsF] = useState(true); 

  const handleInputChange = (event) => {
    setLocation(event.target.value)
  }

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      const url = `https://api.weatherapi.com/v1/current.json?key=844583823f1340f9b8402038231409&q=${location}`;
      axios.get(url)
      .then((response) => {
        setData(response.data);
      }).catch((error) => {
        console.error("Error: ", error);
      })
      setLocation(''); 
    }
  }

  const handleClick = () => {
    setIsF(!isF); 
  }

  useEffect(() => {
    console.log("Data updated:", data);
  }, [data]);

  useEffect(() => {
    const initialUrl = `https://api.weatherapi.com/v1/current.json?key=844583823f1340f9b8402038231409&q=Holland`;
    axios.get(initialUrl)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);

  return (
    <div className="App">
      <div className="top-bar">
        <input 
          type="text"
          placeholder="Enter Location"
          value = {location}
          onChange={handleInputChange}
          onKeyPress={handleSearch}
        />
        <button onClick={handleClick}>{isF ? `°F` : `°C`}</button>
      </div>
      <div className="container">
        <div className="header">
          <div className="location">
            <p>{data.location ? data.location.name: ""}</p>
          </div>
          <div className="temperature">
            <div>
              {data.current ? (
                isF ? (<h1>{data.current.temp_f.toFixed()}°F</h1>) : (<h1>{data.current.temp_c.toFixed()}°C</h1>)
              ): ""}
            </div>
          </div>
          <div className="description">
            <p>{data.current ? data.current.condition.text: ""}</p>
          </div>
          <div className="feels-like">

            <div>
              <p>Feels Like {data.current ? (isF ? (`${data.current.feelslike_f.toFixed()}°F`) : (`${data.current.feelslike_c.toFixed()}°C`)): ""}</p>
            </div>

          </div>
        </div>


        <div className="footer">
          <div className="wind">
          <p>{data.current ? (isF ? (`${data.current.wind_mph.toFixed(1)} MPH`) : (`${data.current.wind_kph.toFixed(1)} KPH`)): ""}</p>
            <p  className="bold">Wind Speed</p>
          </div>
          <div className="precipitation">
          <p>{data.current ? (isF ? (`${data.current.precip_in} in`) : (`${data.current.precip_mm} mm`)): ""}</p>
            <p  className="bold">Precipitation</p>
          </div>
          <div className="humidity">
            <p>{data.current ? data.current.humidity: ""}%</p>
            <p className="bold">Humidity</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
