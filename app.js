const express = require("express");
const app = express();
const axios = require("axios");
const dotenv = require("dotenv");
const bodyParser = require("body-parser")
const getCompletion = require("./openai")
const toggleMode = require("./controllers/modeController")
const extractTime = require("./extractTime")
const Modes = require("./model/modes")
dotenv.config({path: "./config.env"})
app.use(express.json());
app.use(bodyParser.json());
app.get("/", (req, res)=> {
    toggleMode(false);
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

        // turning toggle modes
        if(message.text.body === "##Turn on AI mode##") {
            await toggleMode(true);
            axios({
                url:` https://graph.facebook.com/v20.0/${business_phone_number_id}/messages `,
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.WHATSAPP_API}`,
                    "Content-Type": "application/json"
                },
                data:{
                    "messaging_product": "whatsapp",
                    "to":message.from,
                    "text": {body:  "AI mode activated..." + '\n' + "Hello! How can I assist you today?"}
                    
                   
                    
                }
            })
            axios({
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
        else if(message.text.body == "##Turn off AI mode##") {
            toggleMode(false);
            axios({
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
            axios({
                url:` https://graph.facebook.com/v20.0/${business_phone_number_id}/messages `,
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.WHATSAPP_API}`,
                    "Content-Type": "application/json"
                },
                data:{
                    "messaging_product": "whatsapp",
                    "to":message.from,
                    "text": {body: "AI mode turned off..."}
                    
                   
                    
                }
            })
            
        }
        // sending normal reminder reply
        else {
            const mode = await Modes.findOne();
            console.log(mode);
            if(mode.aiMode == true) {
                const answer = await getCompletion(message.text.body)
                
                axios({
                    url:` https://graph.facebook.com/v20.0/${business_phone_number_id}/messages `,
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.WHATSAPP_API}`,
                        "Content-Type": "application/json"
                    },
                    data:{
                        "messaging_product": "whatsapp",
                        "to":message.from,
                        "text": {body: answer.choices[0].message.content}
                        
                       
                        
                    }
                })
                axios({
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
            } else {
            let msg_body = message.text.body;
            let msgArray=msg_body.split(' ');
            msgArray[msgArray.length-1]=msgArray[msgArray.length-2]=msgArray[msgArray.length-3]="";

            const message1=msgArray.join(" ");
            let time=extractTime(msg_body);
            let recievedTime=new Date(time);
            const currentTime= new Date();
            const timeDifference=(recievedTime-currentTime);
            const sendMessage = async() => {
                axios({
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
                axios({
                    url:` https://graph.facebook.com/v20.0/${business_phone_number_id}/messages `,
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.WHATSAPP_API}`,
                        "Content-Type": "application/json"
                    },
                    data:{
                        "messaging_product": "whatsapp",
                        "to":message.from,
                        "text": {body:  message1}
                        
                       
                        
                    }
                })
                
            }
        
            setTimeout(sendMessage, timeDifference)
        }
        }
            
    }
        
    res.sendStatus(200).end();
})
       

module.exports = app;