const mongoose = require("mongoose");

const NotesSchema = mongoose.Schema({
    title: String,
    body: String,
    userId: String,
    user: String
},{
    versionKey : false
})

const NotesModel = mongoose.model("note", NotesSchema);

module.exports={
    NotesModel
}