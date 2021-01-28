const nodemailer = require("nodemailer");
let transporter = null;
class Mailer {

    async setup() {
        let testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, 
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }

    async sendMail(msg, to) { 
        try {
            let info = await transporter.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: to.join(), // list of receivers
                subject: "Hello ✔", // Subject line
                text: msg, // plain text body
                html: "<p>" + msg + "</p>", // html body
            });
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } catch (error) {
            console.error(error);
        }
    }    
}

export { Mailer };