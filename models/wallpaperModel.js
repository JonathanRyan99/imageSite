const mongoose = require('mongoose');
const Schema = mongoose.Schema;



//create Schema

const wallpaperSchema = new Schema({
    path: {type: String, required: true},
    tags: [{type:String}]
});

//every time code uses wallpaper which referes to mongoose.model, tells it to add the following to the wallpapers collection using the imageSchema
//remember it goes database/collections/data 

//'collection name'
const wallpapers = mongoose.model('wallpapers' , wallpaperSchema);
module.exports = wallpapers;
