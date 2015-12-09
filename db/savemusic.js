var mongoose = require("mongoose");
var fs = require('fs');
//var db = mongoose.connect("mongodb://localhost/myblog");
var db = mongoose.connect('mongodb://123.57.143.189/jpanblog')
db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("数据库连接成功");
});
//定义集合的存储数据结构
var MusicSchema = new mongoose.Schema({
    songName: String,
    content: Buffer
});

var songContent = fs.readFileSync('../public/musics/pokemon_02.mp3');
var MusicModel = db.model("music", MusicSchema);
var music = new MusicModel({
    songName: 'pokemon_01.mp3',
    content: songContent
});

music.save(function(err, song){
    if(err){
        console.log("error:" + err);
    }else{
        console.log(song);
    }
});