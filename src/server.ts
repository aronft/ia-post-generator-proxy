import express from 'express'
require('dotenv').config()
import { TextServiceClient }  from "@google-ai/generativelanguage"
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/text-bison-001";
const API_KEY = process.env.MODEL_LANGUAGE_API_KEY;

const app = express()
app.use(express.json())

const port = 3000;

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

app.post('/generate-post', async(req, res) => {
    const data = req.body
   
    const prompt = `We are a post generator web platform, create a ${data.stely} post style, with a ${data.toneVoice} voice for ${data.platform} platform about ${data.message}`

    
    const responseApi  = await  client.generateText({

      // required, which model to use to generate the result
      model: MODEL_NAME,
      // optional, 0.0 always uses the highest-probability result
      temperature: 0.7,
      // optional, how many candidate results to generate
      candidateCount: 1,
      prompt: {
        text: prompt,
      },
    })

    if (responseApi[0].candidates == null || responseApi[0].candidates.length === 0) {
        res.send({
            status: 500,
            message: "No result",
            data: null
        })
        return
    }

    res.send({
        status: 200,
        message: "Success",
        data: responseApi[0].candidates && responseApi[0].candidates[0].output
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port} `))



