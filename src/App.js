import React, {useState, useEffect} from "react";
import axios from "axios";

function App() {
  const [location, setLocation] = useState('Holland'); 
  const [data, setData] = useState({}); 
  const [isF, setIsF] = useState(true); 
  const [GPTDescription, setGPTDescription] = useState(''); 

  const fetchData = () => {
    const url = 'http://localhost:3001/get-weather'
    axios.get(url, {
      params: {
        location: location, 
      },
    }).then((response) => {
      setData(response.data);
      fetchGPTDescription(response.data); 
    }).catch((error) => {
      console.error("Error: fetchData: ", error)
    })
  }

  const fetchGPTDescription = (weatherData) => {
    if (weatherData && weatherData.current) {
      axios.post("http://localhost:3001/openai-description", {
        city: location, 
        temp: isF? weatherData.current.temp_f.toFixed() : weatherData.current.temp_c.toFixed(), 
        unit: isF? "F" : "C", 
        description: weatherData.current.condition.text, 
      }).then((response) => {
        setGPTDescription(response.data.GPTDescription); 
      }).catch((error) => {
        console.error("Error: ", error); 
      }); 
  } else {
    console.error("Data or data.current is undefined")
  }
  }

  const handleInputChange = (event) => {
    setLocation(event.target.value)
  } 

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      fetchData(location); 
      setLocation(''); 
    }
  }

  const handleClick = () => {
    setIsF(!isF); 
  }

  useEffect(() => {
    fetchData(); 
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
        <div className="left-weather">
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
        <div className="right-gpt">
        <p> {GPTDescription}</p> 
        </div>
      </div>
    </div>
  );
}

export default App;
