const mongoose = require("mongoose");
const ModeSchema = mongoose.Schema({
    aiMode: {
        type: Boolean,
        default: false
    }
})

const Modes = mongoose.model("Modes", ModeSchema);
module.exports = Modes;

