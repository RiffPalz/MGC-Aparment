export const loginEmailTemplate = (userName, verificationCode) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Login Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:20px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" role="presentation"
          style="background-color:#ffffff;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.1);padding:40px;">

          <!-- LOGO -->
          <tr>
            <td align="center" style="padding-bottom:30px;">
              <img 
                src="https://res.cloudinary.com/dliynqlm5/image/upload/v1767977668/MGC_vuybok.png" 
                alt="MGC Building" 
                width="120"
                style="display:block;"
              />
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td align="center" style="color:#333333;">
              <h2 style="margin-bottom:10px;">Admin Login Verification</h2>
              <p style="font-size:16px;">
                Hi <strong>${userName}</strong>, use the verification code below to complete your login:
              </p>

              <div style="
                font-size:28px;
                font-weight:bold;
                color:#c8502e;
                letter-spacing:4px;
                margin:25px 0;
              ">
                ${verificationCode}
              </div>

              <p style="font-size:14px;">
                This code will expire in <strong>5 minutes</strong>.
              </p>

              <p style="font-size:14px;">
                If you did not attempt to log in, please secure your account immediately.
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding-top:30px;font-size:12px;color:#777777;">
              <p>
                Need help? Contact us at
                <a href="mailto:mgcbuilding762@gmail.com" style="color:#c8502e;text-decoration:none;">
                  mgcbuilding762@gmail.com
                </a>
              </p>

              <p style="margin-top:15px;">
                © ${new Date().getFullYear()} MGC Building. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
};

export const applicationReceivedTemplate = (fullName) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Received</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:20px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" role="presentation"
          style="background-color:#ffffff;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.1);padding:40px;">

          <!-- LOGO -->
          <tr>
            <td align="center" style="padding-bottom:30px;">
              <img 
                src="https://res.cloudinary.com/dliynqlm5/image/upload/v1767977668/MGC_vuybok.png" 
                alt="MGC Building" 
                width="120"
                style="display:block;"
              />
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td align="center" style="color:#333333;">
              <h2 style="margin-bottom:10px;">Application Received</h2>

              <p style="font-size:16px;">
                Hi <strong>${fullName}</strong>,
              </p>

              <p style="font-size:16px;">
                Thank you for your interest in renting a unit at <strong>MGC Building</strong>.
              </p>

              <p style="font-size:16px;">
                We have successfully received your application request. Our management team will review your inquiry and contact you shortly.
              </p>

              <p style="font-size:14px;margin-top:25px;">
                If you have any urgent concerns, feel free to reach out to us.
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding-top:30px;font-size:12px;color:#777777;">
              <p>
                Need help? Contact us at
                <a href="mailto:mgcbuilding762@gmail.com" style="color:#c8502e;text-decoration:none;">
                  mgcbuilding762@gmail.com
                </a>
              </p>

              <p style="margin-top:15px;">
                © ${new Date().getFullYear()} MGC Building. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
};

export const passwordResetTemplate = (fullName, resetCode) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background-color:#ffffff;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.1);padding:40px;">
          <tr>
            <td align="center" style="padding-bottom:30px;">
              <img src="https://res.cloudinary.com/dliynqlm5/image/upload/v1767977668/MGC_vuybok.png"
                alt="MGC Building" width="120" style="display:block;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="color:#333333;">
              <h2 style="margin-bottom:10px;">Password Reset Request</h2>
              <p style="font-size:16px;">Hi <strong>${fullName}</strong>,</p>
              <p style="font-size:16px;">Use the code below to reset your password. It expires in <strong>15 minutes</strong>.</p>
              <div style="font-size:32px;font-weight:bold;color:#c8502e;letter-spacing:6px;margin:25px 0;">
                ${resetCode}
              </div>
              <p style="font-size:14px;">If you did not request a password reset, you can safely ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:30px;font-size:12px;color:#777777;">
              <p>Need help? Contact us at
                <a href="mailto:mgcbuilding762@gmail.com" style="color:#c8502e;text-decoration:none;">
                  mgcbuilding762@gmail.com
                </a>
              </p>
              <p style="margin-top:15px;">© ${new Date().getFullYear()} MGC Building. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const accountPendingTemplate = (fullName) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Account Under Review</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background-color:#ffffff;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.1);padding:40px;">
          <tr>
            <td align="center" style="padding-bottom:30px;">
              <img src="https://res.cloudinary.com/dliynqlm5/image/upload/v1767977668/MGC_vuybok.png"
                alt="MGC Building" width="120" style="display:block;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="color:#333333;">
              <h2 style="margin-bottom:10px;">Account Under Review</h2>
              <p style="font-size:16px;">Hi <strong>${fullName}</strong>,</p>
              <p style="font-size:16px;">
                Thank you for registering at <strong>MGC Building</strong>.
              </p>
              <p style="font-size:16px;">
                Your account is currently <strong style="color:#e0a800;">under review</strong>. Our management team will verify your information and notify you once a decision has been made.
              </p>
              <p style="font-size:14px;margin-top:20px;">
                Please allow some time for the review process. We appreciate your patience.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:30px;font-size:12px;color:#777777;">
              <p>Need help? Contact us at
                <a href="mailto:mgcbuilding762@gmail.com" style="color:#c8502e;text-decoration:none;">
                  mgcbuilding762@gmail.com
                </a>
              </p>
              <p style="margin-top:15px;">© ${new Date().getFullYear()} MGC Building. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const accountApprovedTemplate = (fullName) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Account Approved</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background-color:#ffffff;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.1);padding:40px;">
          <tr>
            <td align="center" style="padding-bottom:30px;">
              <img src="https://res.cloudinary.com/dliynqlm5/image/upload/v1767977668/MGC_vuybok.png"
                alt="MGC Building" width="120" style="display:block;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="color:#333333;">
              <h2 style="margin-bottom:10px;color:#2e7d32;">Account Approved</h2>
              <p style="font-size:16px;">Hi <strong>${fullName}</strong>,</p>
              <p style="font-size:16px;">
                We are pleased to inform you that your tenant account at <strong>MGC Building</strong> has been <strong style="color:#2e7d32;">approved</strong>.
              </p>
              <p style="font-size:16px;">
                You may now log in to your account and access the tenant portal.
              </p>
              <p style="font-size:14px;margin-top:20px;">
                Welcome to MGC Building. We look forward to having you as a tenant.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:30px;font-size:12px;color:#777777;">
              <p>Need help? Contact us at
                <a href="mailto:mgcbuilding762@gmail.com" style="color:#c8502e;text-decoration:none;">
                  mgcbuilding762@gmail.com
                </a>
              </p>
              <p style="margin-top:15px;">© ${new Date().getFullYear()} MGC Building. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const accountDeclinedTemplate = (fullName) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Account Request Declined</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background-color:#ffffff;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.1);padding:40px;">
          <tr>
            <td align="center" style="padding-bottom:30px;">
              <img src="https://res.cloudinary.com/dliynqlm5/image/upload/v1767977668/MGC_vuybok.png"
                alt="MGC Building" width="120" style="display:block;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="color:#333333;">
              <h2 style="margin-bottom:10px;color:#c62828;">Account Request Declined</h2>
              <p style="font-size:16px;">Hi <strong>${fullName}</strong>,</p>
              <p style="font-size:16px;">
                We regret to inform you that your tenant account request at <strong>MGC Building</strong> has been <strong style="color:#c62828;">declined</strong>.
              </p>
              <p style="font-size:16px;">
                If you believe this is an error or would like further clarification, please do not hesitate to contact us.
              </p>
              <p style="font-size:14px;margin-top:20px;">
                We appreciate your interest and hope to assist you in the future.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:30px;font-size:12px;color:#777777;">
              <p>Need help? Contact us at
                <a href="mailto:mgcbuilding762@gmail.com" style="color:#c8502e;text-decoration:none;">
                  mgcbuilding762@gmail.com
                </a>
              </p>
              <p style="margin-top:15px;">© ${new Date().getFullYear()} MGC Building. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
