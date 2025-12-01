
require('dotenv').config(); 

// 2. Import core packages
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai'); 

const app = express();
const PORT = 5000; 

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY}); 

console.log("Is the key defined?", !!process.env.GEMINI_API_KEY);

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json()); 

app.post('/api/battle', async (req, res) => {
   
    const { pokemonOne, pokemonTwo } = req.body; 

    if (!pokemonOne || !pokemonTwo) {
        return res.status(400).json({ error: 'Missing Pokémon names.' });
    }

    try {
        const prompt = `Write me a detailed 500 word battle between ${pokemonOne} and ${pokemonTwo}.`;

       
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: 'Be a rich story teller that generates a Pokémon battle.',
                temperature: 0.9,
            },
        });

        
        res.json({ battleDescription: response.text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: 'Failed to generate battle description.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening securely on http://localhost:${5000}`);
});

