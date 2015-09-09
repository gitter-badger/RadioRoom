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
    router.post('/station', function(req, res, next) {

    });
    router.post('/stream', function(req, res, next) {

        if (!req.body.url) {
            return res.sendStatus(500);
        }
        var link = req.body.url;
        console.log('url submitted: ' + link);
        /*var source = youtubedl(req.body.url, ['-x','--audio-format', 'mp3','-f','140', '--max-filesize', '40m', '--id'], {
            cwd: __dirname + '/../data/'
        });
        /**/
        youtubedl.exec(link, ['-x', '--audio-format', 'mp3', '--id'], {
            cwd: __dirname + '/../data/'
        }, function(err, output) {
            if (err) throw err;
            //console.log(output)
            youtubedl.getInfo(link, function(err, info) {
                if (err) throw err;

                console.log('id:', info.id);
                console.log('title:', info.title);
                console.log('url:', info.url);
                console.log('thumbnail:', info.thumbnail);
                //console.log('description:', info.description);
                console.log('filename:', info._filename);
                console.log('format id:', info.format_id);
                return res.render('stream', {
                    title: 'RR | ' + info.title,
                    meta: info,
                    fileName: info.id + '.mp3',
                    thumb: info.thumbnail
                });
            });
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