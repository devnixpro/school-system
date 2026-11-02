const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, code) => {
  // Gmail ka transporter banayein
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email ke options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your DevNixEdu Account',
    text: `Your OTP for account verification is: ${code}. It is valid for 10 minutes.`,
  };

  // Email bhejein
  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;