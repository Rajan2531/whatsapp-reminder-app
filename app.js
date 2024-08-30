const express = require("express");
const app = express();
const axios = require("axios");
const dotenv = require("dotenv");
const bodyParser = require("body-parser")
const getCompletion = require("./openai")
dotenv.config({path: "./config.env"})
app.use(express.json());
app.use(bodyParser.json());
app.get("/", (req, res)=> {
    console.log(process.env.WHATSAPP_API)
    res.status(200).json({
        status:"working"
    })
})

app.get("/webhook", (req, res)=> {
    console.log(req.query);
    const mode = req.query["hub.mode"];
    const challenge = req.query["hub.challenge"];
    const token = req.query["hub.verify_token"];
    if(mode === "subscribe" && token == process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }

});


app.post("/webhook", async (req, res)=> {
    
    const message = req.body.entry[0]?.changes[0]?.value?.messages?.[0];
    console.log(message);
    if(message?.type === "text") {
        const business_phone_number_id = req.body.entry[0]?.changes[0]?.value?.metadata?.phone_number_id;

        // sending message as reply
        await axios({
            url:` https://graph.facebook.com/v20.0/${business_phone_number_id}/messages `,
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.WHATSAPP_API}`,
                "Content-Type": "application/json"
            },
            data:{
                "messaging_product": "whatsapp",
                "to":message.from,
                "text": {body:  message.text.body}
                
               
                
            }
        })
        await axios({
            url:` https://graph.facebook.com/v20.0/${business_phone_number_id}/messages `,
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.WHATSAPP_API}`,
                "Content-Type": "application/json"
            },
            data:{
                "messaging_product": "whatsapp",
                "status":"read",
                "message_id": message.id
               
                
            }
        })
    }
    res.sendStatus(200).end();
})
       

module.exports = app;