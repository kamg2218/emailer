let mailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

let transporter = mailer.createTransport({
  service: process.env.MAIL_SERVICE,
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  secure: true,
  port: 465,
  tls: {
    maxVersion: process.env.MAIL_TLS_MAXVERSION,
    minVersion: process.env.MAIL_TLS_MINVERSION,
    ciphers: process.env.MAIL_TLS_CIPHERS,
  }
});

//sending mail to person with email
const sendMail = (email) => {
  let mailOptions = {
    from: `42CABI <${process.env.MAIL_FROM}>`,
    to: email,
    subject: '42CABI 사물함 연체 알림',
    text: fs.readFileSync('./overdue.txt', 'utf8'),
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(email + ': ' + info.response);
    }
  });
}

//sending mail to everyone
const mailing = () => {
  const fortytwo = '@student.42seoul.kr';

  // let data = fs.readFileSync('./names.txt', 'utf8');
  let data = fs.readFileSync('./test.txt', 'utf8');
  while (data) {
    let idx = data.indexOf('\n');
    //공백 제거
    if (idx == -1) {
      data = data.replace(/(\s*)/g, "");
      // console.log(data);
      sendMail(data + fortytwo);
      break ;
    } else {
      let mail = data.slice(0, idx);
      //공백 제거
      mail = mail.replace(/(\s*)/g, "");
      if (mail !== '') {
        // console.log(mail)
        sendMail(mail + fortytwo);
      }
      data = data.slice(idx + 1);
    }
  }
};

mailing();
