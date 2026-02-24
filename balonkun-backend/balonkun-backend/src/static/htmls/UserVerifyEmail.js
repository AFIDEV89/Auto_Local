export const UserVerifyEmail = (link) => {
    return `<html>
      <h2>Please click below to verify your email.</h2>
      <br/>
      <a href="${link}">Click here</a>
    </html>`;
};
