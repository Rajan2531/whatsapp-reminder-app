const {OpenAI} = require("openai");
const dotenv = require("dotenv")
dotenv.config({path: "./config.env"});
const onenai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY_USER
})

const getCompletion =async(prompt, token_len = 100) => {const data = await onenai.chat.completions.create({
    model:"gpt-3.5-turbo",
    messages:[{"role":"user", "content": prompt}],
    temperature: 0.8,
    max_tokens:token_len
})
console.log(data.choices[0].message.content);
return data}

module.exports = getCompletion;