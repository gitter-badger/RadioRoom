var mongoose = require('mongoose');

//TODO: make own file.
var track = mongoose.Schema({
    
});

var Station = mongoose.Schema({
    songQ: [track],//will eventually be its own object type
    playing: track,
    played: [track]
});


module.exports = mongoose.model('station', Station);