import Mailgen from "mailgen";

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

export { emailVerificationMailgenContent, forgotPasswordMailgenContent };
