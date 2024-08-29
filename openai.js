const {OpenAI} = require("openai");
const dotenv = require("dotenv")
dotenv.config({path: "./config.env"});
const onenai = new OpenAI({
    apiKey:process.env.openai_api_key_user
})

const getCompletion =async(prompt, token_len = 20) => {const data = await onenai.chat.completions.create({
    model:"gpt-3.5-turbo",
    messages:[{"role":"user", "content": prompt}],
    temperature: 0.8,
    max_tokens:token_len
})
return data}

module.exports = getCompletion;