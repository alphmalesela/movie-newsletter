const nodemailer = require("nodemailer");
const { config } = require('./config');
let transporter = null;
class Mailer {

    async setup() {
        transporter = nodemailer.createTransport({
            host: config.EMAIL_HOST,
            port: config.EMAIL_HOST_PORT,
            auth: {
                user: config.EMAIL_AUTH_USER,
                pass: config.EMAIL_AUTH_PASS
            }
        });
    }

    async sendMail(movie, to) { 
        try {
            console.log('movie.poster_path:. ', movie.poster_path);
            let info = await transporter.sendMail({
                from: '<movielist@gmail.com>', // sender address
                to: to.join(), // list of receivers
                subject: 'Movie of the Day: ' + movie.title, // Subject line
                html: '<div class="row">' 
                    + '<div class="col1">'
                        +'<img src="cid:uniqueid"/>'
                    + '</div>' 
                    + '<div class="col2">'
                        + '<span><h1 style="color:#800000">' + movie.title + ' </h1><h2><span style="color:#800000">' + movie.vote_average + '/10<span> IMDB</h2></span><br/>'
                        + '<p>' + movie.overview + '</p>'
                    + '</div>' 
                + '</div>'
                + '<style>'
                    + 'img{max-width: 100%;max-height: 100%;display: block;}'
                    + '.row:after {content: "";display: table;clear: both;}'
                    + '.col1 {float: left; width:40%}'
                    + '.col2 {float: left; width:60%}'
                +'</style>',
                attachments:[{
                    path: 'https://image.tmdb.org/t/p/w500'+movie.poster_path,
                    cid: 'uniqueid'
                }]
            });
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } catch (error) {
            console.error(error);
        }
    }    
}

module.exports = Mailer;