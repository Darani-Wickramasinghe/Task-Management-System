import nodemailer from 'nodemailer';

/**
 * Sends a welcome email containing a temporary password to onboarding users.
 * If SMTP credentials are not configured in the environment, it prints the complete
 * email structure to the console for verification.
 * 
 * @param {string} email Recipient email address
 * @param {string} name Recipient full name
 * @param {string} tempPassword Generated temporary password
 */
export async function sendWelcomeEmail(email, name, tempPassword) {
  const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

  let transporter;
  if (hasSmtpConfig) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Print mock email structure in logs for seamless manual testing / verification
    console.log('\n================== [MOCK WELCOME EMAIL] ==================');
    console.log(`FROM: ${process.env.SMTP_FROM || 'no-reply@taskflow.com'}`);
    console.log(`TO: ${email}`);
    console.log(`SUBJECT: Welcome to Taskflow - Your Temporary Credentials`);
    console.log('---------------------------------------------------------');
    console.log(`Hi ${name},`);
    console.log('\nYour administrator has created an account for you on Taskflow.');
    console.log('You can log in using the following credentials:');
    console.log(`  - Username/Email: ${email}`);
    console.log(`  - Temporary Password: ${tempPassword}`);
    console.log('\nImportant: You will be prompted to reset this password upon your first login.');
    console.log(`Link: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`);
    console.log('==========================================================\n');
    return { mock: true, recipient: email };
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || '"Taskflow Team" <no-reply@taskflow.com>',
    to: email,
    subject: 'Welcome to Taskflow - Your Temporary Credentials',
    text: `Hi ${name},\n\nYour administrator has created an account for you on Taskflow.\n\nYour credentials are:\nEmail: ${email}\nTemporary Password: ${tempPassword}\n\nYou must reset this password upon your first login.\n\nLogin: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #7c3aed; margin-top: 0;">Welcome to Taskflow, ${name}!</h2>
        <p style="color: #334155; font-size: 16px; line-height: 1.5;">Your administrator has created an account for you on the Task Management System.</p>
        <p style="color: #334155; font-size: 16px; line-height: 1.5;">Use the following temporary credentials to log in:</p>
        <div style="background-color: #f8fafc; padding: 16px; border: 1px solid #cbd5e1; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 4px 0; font-size: 15px; color: #1e293b;"><strong>Username / Email:</strong> ${email}</p>
          <p style="margin: 4px 0; font-size: 15px; color: #1e293b;"><strong>Temporary Password:</strong> <code style="background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-family: monospace;">${tempPassword}</code></p>
        </div>
        <p style="color: #ef4444; font-size: 14px; font-weight: 600; margin-top: 16px;">Important: You must reset your password upon logging in for the first time.</p>
        <div style="margin-top: 24px; text-align: center;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #6d28d9); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.4);">
            Log In Now
          </a>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0 24px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">This is an automated system email. Please do not reply directly.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}
