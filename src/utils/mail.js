import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (Option) => {
   const mailGenerator = new Mailgen({
      theme: "default",
      product: {
         name: "Task Manager",
         link: "https://taskmangelink.com/",
      },
   });
   const emailTextual = mailGenerator.generatePlaintext(Option.mailgenContent);

   const emailHTML = mailGenerator.generate(Option.mailgenContent);

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMPT_HOST,
    port: process.env.MAILTRAP_SMPT_PORT,
    auth:{
        user: process.env.MAILTRAP_SMPT_USER,
        pass: process.env.MAILTRAP_SMPT_PASS,
    }
})

const mail = {
    from : "kunal@basecamp.com",
    to : Option.email,
    subject : Option.subject,
    text: emailTextual,
    html: emailHTML,
}

try {
    await transporter.sendMail(mail);
} catch (error) {
    console.error("Error sending email. make sure you have provided mailTrap credentials in .env file", error);
}
};


const emailVerificationMailgenContent = (username, verificationUrl) => {
   return {
      body: {
         name: username,
         intro: "welcome to our App! We're very excited to have you on board.",
         action: {
            instructions: "To verify your email, please click the button",
            button: {
               color: "#22BC66",
               text: "Verify Email",
               link: verificationUrl,
            },
         },
         outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
   };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
   return {
      body: {
         name: username,
         intro: "We got request to reset the password of your account.",
         action: {
            instructions:
               "To reset your password, please click the following button or link",
            button: {
               color: "#13f676",
               text: "password reset ",
               link: passwordResetUrl,
            },
         },
         outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
   };
};

export { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail };
