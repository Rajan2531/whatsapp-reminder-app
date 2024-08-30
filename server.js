const app = require("./app")




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


// connection to database
const mongoose = require("mongoose");
const Mode = require("./model/modes")
const url = process.env.DATABASE_URL.replace("<password>", process.env.PASSWORD);
const db = mongoose.connect(url).then(()=>{
     
    console.log("database connected.")
})


app.listen(process.env.PORT, () => {
    console.log("server running on port 3000.");
})