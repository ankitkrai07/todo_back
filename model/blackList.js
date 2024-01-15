const mongoose = require("mongoose");

const BListSchema = mongoose.Schema({
    token: {type: String, required:true}
},{
    versionKey : false
})

const BListModel = mongoose.model("Blacklist", BListSchema);

module.exports={
    BListModel
}