const app = require("./app")
const axios = require("axios");
const dotenv = require("dotenv");
const getCompletion = require("./openai")
dotenv.config({path: "./config.env"})



// const data = async() => {const data = await axios({
//     url: "https://api.openai.com/v1/chat/completions",
//     headers: {
//         Authorization: `Bearer ${process.env.openai_api_key_user}`
//     },
//     method: "POST",
//     data:{
//         "model": "gpt-4o-mini",
//         "messages": [{"role": "user", "content":"what is cow!"}],
//         "temperature": 0.7,
//         "max_tokens": 50
//     }

// })
// console.log(data.data.choices[0].message.content)
// return data}
// data();


// app.listen(3000, ()=>{
//     console.log("Server is running on port 3000.");
// })


//  axios({
//     url:" https://graph.facebook.com/v20.0/128793470324905/messages",
//     method: "post",
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${process.env.whatsapp_api}`
//     },
//     data: {
//         "messaging_product" : "whatsapp",
//         "recipient_type": "individual",
//         "to": "+917003340346",
//         "type": "template",
//         "template": {
//             "name": "hello_world", 
//             "language": {
//                 "code": "en_US"
//             }
//         }
//     }
// })
// curl 'https://graph.facebook.com/v17.0/106540352242922/messages' \
// -H 'Content-Type: application/json' \
// -H 'Authorization: Bearer EAAJB...' \
// -d '
// {
//   "messaging_product": "whatsapp",
//   "recipient_type": "individual",
//   "to": "+16505555555",
//   "type": "text",
//   "text": {
//     "preview_url": true,
//     "body": "Here'\''s the info you requested! https://www.meta.com/quest/quest-3/"
//   }
// }'










// getting 
//getCompletion("how to eat egg", 10).then(data => console.log(data.choices[0].message.content));


app.get("/webhook", (req, res)=> {
    const mode = req.query["hub.mode"];
    const challenge = req.query["hub.challenge"];
    const token = req.query["hub.token"];
    if(mode === "subscribe" && token == process.env.whatsapp_webhook_verify_token) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }

});


app.post("/webhook", async (req, res)=> {
    const message = req.body.entry?.changes[0]?.value?.messages?.[0];
    if(message?.type === "text") {
        const business_phone_number_id = req.body.entry?.changes[0]?.value?.metadata?.phone_number_id;

        // sending message as reply
        await axios({
            url:` https://graph.facebook.com/v20.0/${business_phone_number_id}/messages `,
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.whatsapp_api}`,
                "Content-Type": "application/json"
            },
            data:{
                "messaging_product": "whatsapp",
                "to":message.from,
                "text": {body: "Echo: " + message.text.body},
                "context": {
                    "message_id": message_id
                }
            }
        })
    }
})


app.listen(process.env.port, () => {
    console.log("server running on port 3000.");
})