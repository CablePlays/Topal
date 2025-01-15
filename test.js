const nodemailer = require("nodemailer")

// hrlz zflv zunz hqik
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "topal2024online@gmail.com",
        pass: "hrlz zflv zunz hqik"
    }
})

async function sendMail(to, subject, html) {
    console.info("Sending email")

    transporter.sendMail({
        from: '"Topal" <topal2024online@treverton.co.za>',
        to,
        subject,
        html
    }, (error, info) => {
        if (error) {
            console.error(error)
            return
        }

        console.info(info)
    })
}

sendMail("4jencal@treverton.co.za", "Test Topal Email", "<i>Is this working? :)</i>")