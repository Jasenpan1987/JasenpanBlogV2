var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/myblog');
mongoose.connect('mongodb://123.57.143.189/jpanblog')
var ObjectId = mongoose.Schema.Types.ObjectId;

mongoose.model('User',new mongoose.Schema({
    username:String,
    email:String,
    avatar:String,
    password:String
}));

var articleSchema = new mongoose.Schema({
    title:String,
    content:String,
    image: {type:ObjectId,ref:'Image'},
    user:{type:ObjectId,ref:'User'}//对象ID类型，引用User
    //author:String

});



mongoose.model('Article', articleSchema);

var imageSchema = new mongoose.Schema({
    filename:String,
    filecontent:String
});

mongoose.model('Image', imageSchema);


var MusicSchema = new mongoose.Schema({
    songName: String,
    content: Buffer
});

mongoose.model("Music", MusicSchema);

global.Model = function(modName){
    return mongoose.model(modName);
};