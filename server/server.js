const express = require("express"); 
const axios = require("axios"); 
const cors = require('cors'); 
const OpenAI = require("openai")

require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; 
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
})

const app = express(); 
const PORT = process.env.PORT || 3001; 

app.use(express.json());
app.use(cors()); 

app.get("/get-weather", async(req, res) => {
    try{
        const location = req.query.location; 
        console.log(location)
        const url = `https://api.weatherapi.com/v1/current.json?key=844583823f1340f9b8402038231409&q=${location}`;
        const response = await axios.get(url); 
        res.status(200).json(response.data); 
    } catch(error) {
        console.error(error); 
        res.status(500).json({error: 'error retrieving weather api data'})
    }
})


app.post("/openai-description", async (req, res) => {
    try {
        const city = req.body.city; 
        const temp = req.body.temp; 
        const unit = req.body.unit; 
        const description = req.body.description; 
        const prompt = `The weather in ${city} is ${description}. It is ${temp} degrees ${unit}.`
        
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", 
            messages: [{"role": "system", "content": prompt},
                        {role: "user", content: "Summarize the weather for the day without including numerical values. Describe it to me in at most three conversational sentences like you are a weatherman; do not reference time (do not say good morning, good evening, good night, etc.) and include the specified city name."}]
        })

        const weatherDescription = response.choices[0].message.content; 
        res.json({GPTDescription: weatherDescription}); 
    } catch (error) {
        console.error("Error: ", error); 
        res.status(500).json({error: "internal server error "})
    }
}); 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
}); 