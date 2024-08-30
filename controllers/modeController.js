const Modes = require("./../model/modes");
const toggleMode = async (value) => {
    try{
         let initialValue = await Modes.findOne();
         console.log(initialValue);
         if(!initialValue) {
            console.log("called")
            initialValue = await Modes.create({aiMode});
         } else {
         initialValue = await Modes.findByIdAndUpdate(initialValue._id,{aiMode: value}, {new: true});
         }
         console.log(initialValue);
    } catch(err) {
        console.log(err.data)
    }
}

module.exports= toggleMode;