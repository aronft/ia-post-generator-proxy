import express from 'express'
require('dotenv').config()
import { TextServiceClient } from "@google-ai/generativelanguage"
const { GoogleAuth } = require("google-auth-library");
const cors = require('cors');

const MODEL_NAME = "models/text-bison-001";
const API_KEY = process.env.MODEL_LANGUAGE_API_KEY;

const app = express()
app.use(express.json())
app.use(cors());


const port = 3000;

const client = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

app.post('/generate-post', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const data = req.body

    console.log(data)

    const prompt = `Create a post for the ${data.platform} social media with ${data.stely} style and ${data.toneVoice} voice. input: ${data.message}`

    const responseApi = await client.generateText({

        // required, which model to use to generate the result
        model: MODEL_NAME,
        // optional, 0.0 always uses the highest-probability result
        temperature: 0.7,
        // optional, how many candidate results to generate
        candidateCount: 1,
        //   // optional, number of most probable tokens to consider for generation
        topK: 40,
        // optional, for nucleus sampling decoding strategy
        topP: 0.95,
        maxOutputTokens: 1024,
        // optional, safety settings
        safetySettings: [{ "category": "HARM_CATEGORY_DEROGATORY", "threshold": 1 }, { "category": "HARM_CATEGORY_TOXICITY", "threshold": 1 }, { "category": "HARM_CATEGORY_VIOLENCE", "threshold": 2 }, { "category": "HARM_CATEGORY_SEXUAL", "threshold": 2 }, { "category": "HARM_CATEGORY_MEDICAL", "threshold": 2 }, { "category": "HARM_CATEGORY_DANGEROUS", "threshold": 2 }],
        prompt: {
            text: prompt,
        },
    })

    if (responseApi[0].candidates == null || responseApi[0].candidates.length === 0) {
        res.statusCode = 500
        res.send({
            status: 500,
            message: "No result",
            data: null
        })
        return
    }
    res.statusCode = 200
    res.send({
        status: 200,
        message: "Success",
        data: responseApi[0].candidates && responseApi[0].candidates[0].output
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port} `))
