import React, {useState, useEffect} from "react";
import axios from "axios";

function App() {
  const [location, setLocation] = useState('')
  const [data, setData] = useState({})

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
      <div className="search">
        <input 
          type="text"
          placeholder="Enter Location"
          value = {location}
          onChange={handleInputChange}
          onKeyPress={handleSearch}
        />
      </div>
      <div className="container">
        <div className="header">
          <div className="location">
            <p>{data.location ? data.location.name: ""}</p>
          </div>
          <div className="temperature">
            <h1>{data.current ? data.current.temp_f.toFixed(): ""}&deg;F</h1>
          </div>
          <div className="description">
            <p>{data.current ? data.current.condition.text: ""}</p>
          </div>
          <div className="feels-like">
            <p>Feels Like {data.current ? data.current.feelslike_f.toFixed(): ""}&deg;F</p>
          </div>
        </div>


        <div className="footer">
          <div className="wind">
            <p>{data.current ? data.current.wind_mph.toFixed(1) : ""} MPH</p>
            <p  className="bold">Wind Speed</p>
          </div>
          <div className="precipitation">
            <p>{data.current ? data.current.precip_in : ""} in</p>
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
