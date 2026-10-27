import { EmailSubjectEnum } from "../../enum/email.enum.js";

export const EmailTemplate = {
  [EmailSubjectEnum.CONFIRM_EMAIL]: (code) => {
    return `
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Confirm Your Email</h1>

          <p>
            Your verification code is:
          </p>

          <h2>${code}</h2>

          <p>
            This code expires in 5 minutes.
          </p>
        </body>
      </html>
    `;
  },

  [EmailSubjectEnum.FORGOT_PASSWORD]: (code) => {
    return `
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Forgot Password Verification</h1>

          <p>
            Your verification code is:
          </p>

          <h2>${code}</h2>

          <p>
            This code expires in 5 minutes.
          </p>
        </body>
      </html>
    `;
  },
};
