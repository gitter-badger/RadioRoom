var express = require("express");
var ensureLogin = require('connect-ensure-login');
var fs = require('fs');
var path = require("path");
var youtubedl = require('youtube-dl');
var avconv = require('avconv');

var ensureAuthenticated = ensureLogin.ensureAuthenticated;
exports.setup = function() {
    var router = express.Router();

    router.get('/', function(req, res, next) { //index route
        res.render('index', {
            title: "Radio Room"
        });
    });
    router.get('/station/:id', function(req, res, next) {
        
    });
    router.post('/station', function(req,res,next){
        
    });
    router.post('/stream', function(req, res, next) {

        if (!req.body.url) {
            return res.sendStatus(500);
        }
        var link = req.body.url;
        console.log('url submitted: ' + link);
        var source = youtubedl(req.body.url, ['-f','140', '--max-filesize', '40m', '--id'], {
            cwd: __dirname + '/../data/'
        });
        var fileName = '';
        var filePath = '';
        var meta = {}
        source.on('info', function(info) {
            console.log('Download started');
            console.log('filename: ' + info._filename);
            console.log('thumbnail:', info.thumbnail);
            console.log('duration:', info.duration);
            console.log('size: ' + info.size);
            meta = info;
            fileName = info._filename;
            filePath = path.resolve(path.join(__dirname, '../data', fileName));
            source.pipe(fs.createWriteStream(filePath));
        });

        source.on('end', function() {
            res.render('stream', {
                    title: 'RR | ' + meta.title,
                    meta: meta,
                    fileName: fileName,
                    thumb: meta.thumbnail
            });
            /*var params = ['-i', 'pipe:0', '-f', 'mp3', // We only want audio back 
                '-ab',
                '128000',
                '-vn',
                'pipe:1'
            ];
            var stream = avconv(params);
            console.log('trying to convert to mp3');
            
            fs.createReadStream(filePath).pipe(stream);
            stream.pipe(fs.createWriteStream(filePath.substr(0, filePath.lastIndexOf('.')) + ".mp3"));
            stream.on('message', function(data) {
                console.log(data);
            });
            stream.once('exit', function(exitCode, signal) {
                console.log(signal);
                console.log(exitCode);
                fs.unlink(filePath);
                res.render('stream', {
                    title: meta.title,
                    fileName: fileName.substr(0, fileName.lastIndexOf('.')) + ".mp3",
                    thumb: meta.thumbnail
                });
            });*/
        });
    });
    //#########
    //api stuff
    //#########
    router.get('/song/:name', function(req, res, next) {
        //var path = '/home/ubuntu/workspace/data/paralyzer.mp3';
        console.log(__dirname);
        var myPath = path.resolve(path.join(__dirname, '../data', req.params.name));
        console.log(myPath);
        var stat = fs.stat(myPath.toString(), function(err, stats) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
            else {
                res.writeHead(200, {
                    'Content-type': 'audio/mp3',
                    'Content-Length': stats.size
                });
                var stream = fs.createReadStream(myPath);
                stream.pipe(res);
                stream.on('close', function() {
                    fs.unlink(myPath);
                });
            }
        });
    });

    return router;
};