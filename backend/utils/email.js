import nodemailer from 'nodemailer';

const createTransporter = () => {
  try {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } catch (error) {
    console.error('Email transporter creation failed:', error);
    return null;
  }
};

const createEmailTemplate = (subject, text) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          background-color: #1a41bc;
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          padding: 30px 20px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0 0 8px 8px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #718096;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #1a41bc;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 20px;
        }
        .divider {
          height: 1px;
          background-color: #e2e8f0;
          margin: 20px 0;
        }
        @media only screen and (max-width: 600px) {
          .email-container {
            width: 100% !important;
            padding: 10px !important;
          }
          .header, .content {
            padding: 20px 15px !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">ई-Nagarpalika</div>
          <div style="font-size: 18px;">${subject}</div>
        </div>
        <div class="content">
          <p style="font-size: 16px; margin-bottom: 20px;">
            ${text}
          </p>
          <div class="divider"></div>
          <p style="font-size: 14px; color: #718096;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ई-Nagarpalika. All rights reserved.</p>
          <p>
            For support, please contact:
            <a href="mailto:support@nagarpalika.gov.in" style="color: #1a41bc; text-decoration: none;">
              support@nagarpalika.gov.in
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.error('Email transporter not configured');
      return false;
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html: createEmailTemplate(subject, text)
    };

    await transporter.verify();
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};