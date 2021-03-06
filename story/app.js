var ffmpeg = require('ffmpeg');
var sync = require('child_process').spawnSync;
var telegram = require('telegram-bot-api');
var fs = require('fs');
var download = require('download-file');
var randomstring = require("randomstring");
var fileExtension = require('file-extension');

var path = 'user' + Math.floor(100000 + Math.random() * 900000);
//var path = '';

var api = new telegram({
    token: '501984238:AAE-swX9LngGqHcHaEbI3imbflqLjouT1G8',

    updates: {
        enabled: true
    }
});

var step = 1;
var building = false;


// var ls = sync('ffmpeg', ['-loop', '1', '-i', 'a.jpg', '-i', 'a.mp3', '-c:v', 'libx264', '-t', '60', '-pix_fmt', 'yuv420p', '-vf', 'scale=566:1080', '-y', 'out.mp4']);
// var part1 = sync('ffmpeg', ['-ss', '0', '-i', 'out.mp4', '-t', '15', '-c', 'copy', 'part1.mp4']);
// var part2 =  sync('ffmpeg', ['-ss' ,'14', '-i', 'out.mp4' , '-t', '15', '-c' ,'copy' ,'part2.mp4']);
// var part3 =  sync('ffmpeg', ['-ss' ,'29', '-i', 'out.mp4' , '-t', '15', '-c' ,'copy' ,'part3.mp4']);
// var part4 =  sync('ffmpeg', ['-ss' ,'44', '-i', 'out.mp4' , '-t', '15', '-c' ,'copy' ,'part4.mp4']);

api.on('message', function(message) {
    var theImage = '';
    var theAudio = '';
    if (!building) {
        path = 'user' + Math.floor(100000 + Math.random() * 900000);
    }

    if (message.photo) {
        if (step == 1) {
            api.getFile({
                file_id: message.photo[2].file_id
            }).then(function(data) {
                api.sendMessage({
                    chat_id: message.chat.id,
                    parse_mode: 'Markdown',
                    text: 'Now Send an Audio'

                });
                var url = 'https://api.telegram.org/file/bot501984238:AAE-swX9LngGqHcHaEbI3imbflqLjouT1G8/' + data.file_path;
                var options = {
                    directory: "./" + path,
                    filename: "photo." + fileExtension(data.file_path.replace('photos/', ''))
                }

                download(url, options, function(err, res) {});
                step = 2;
                building = true;

            });
        } else {
            api.sendMessage({
                chat_id: message.chat.id,
                parse_mode: 'Markdown',
                text: 'Now Send an Audio'

            });
        }

    }

    if (message.audio) {
        if (step == 2 && building) {
            api.getFile({
                file_id: message.audio.file_id
            }).then(function(data) {

                api.sendMessage({
                    chat_id: message.chat.id,
                    parse_mode: 'Markdown',
                    text: 'Okay! Please Wait...'

                });
                var audio_url = 'https://api.telegram.org/file/bot501984238:AAE-swX9LngGqHcHaEbI3imbflqLjouT1G8/' + data.file_path;

                var audio_options = {
                    directory: "./" + path,
                    filename: "audio." + fileExtension(data.file_path.replace('music/', ''))

                }

                var dl = download(audio_url, audio_options, function(err, res) {
                    if (res) {

                        var ls = sync('ffmpeg', ['-loop', '1', '-i', path + '/' + 'photo.jpg', '-i', path + '/' + 'audio.mp3', '-c:v', 'libx264', '-t', '60', '-pix_fmt', 'yuv420p', '-vf', 'scale=566:1080', '-y', path + '/' + 'out.mp4']);
                        var part1 = sync('ffmpeg', ['-i', path + '/' + 'out.mp4', '-ss', '0', '-t', '15', path + '/' + 'part1.mp4']);
                        var part2 = sync('ffmpeg', ['-i', path + '/' + 'out.mp4', '-ss', '15', '-t', '15', path + '/' + 'part2.mp4']);
                        var part3 = sync('ffmpeg', ['-i', path + '/' + 'out.mp4', '-ss', '30', '-t', '15', path + '/' + 'part3.mp4']);
                        var part4 = sync('ffmpeg', ['-i', path + '/' + 'out.mp4', '-ss', '45', '-t', '15', path + '/' + 'part4.mp4']);
                        api.sendMessage({
                            chat_id: message.chat.id,
                            parse_mode: 'Markdown',
                            text: 'Your videos are ready!'
                        });

                        var send = function() {
                            if (part1) {
                                api.sendVideo({
                                    chat_id: message.chat.id,
                                    video: path + '/' + 'part1.mp4',
                                    duration: 15,
                                    width: 566,
                                    height: 1080,
                                    caption: 'Part 1'

                                });
                            }
                            if (part2) {
                                api.sendVideo({
                                    chat_id: message.chat.id,
                                    video: path + '/' + 'part2.mp4',
                                    duration: 15,
                                    width: 566,
                                    height: 1080,
                                    caption: 'Part 2'

                                });
                            }
                            if (part3) {
                                api.sendVideo({
                                    chat_id: message.chat.id,
                                    video: path + '/' + 'part3.mp4',
                                    duration: 15,
                                    width: 566,
                                    height: 1080,
                                    caption: 'Part 3'

                                });
                            }
                            if (part4) {
                                api.sendVideo({
                                    chat_id: message.chat.id,
                                    video: path + '/' + 'part4.mp4',
                                    duration: 15,
                                    width: 566,
                                    height: 1080,
                                    caption: 'Part 4'

                                });
                            }

                            if (part4) {
                                api.sendVideo({
                                    chat_id: message.chat.id,
                                    video: path + '/' + 'out.mp4',
                                    duration: 60,
                                    width: 566,
                                    height: 1080,
                                    caption: '1 Minute Full Video'
                                });
                            }

                        };

                        send();
                        step = 1;

                        building = false;
                    }
                });





            });
        } else {
            api.sendMessage({
                chat_id: message.chat.id,
                parse_mode: 'Markdown',
                text: 'Please send a photo first!'

            });
            step = 1;
            building = false;
        }

    }
    if (!message.audio && !message.photo) {
        api.sendMessage({
            chat_id: message.chat.id,
            parse_mode: 'Markdown',
            text: 'Wrong Message Format'

        });
        step = 1;
        building = false;
    }

    //console.log(message);
});