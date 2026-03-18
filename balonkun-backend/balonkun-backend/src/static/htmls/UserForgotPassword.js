export const UserForgotPassword = (link) => {
  return `<html>
    <h2>Please click below to reset your current password.</h2>
    <br/>
    <a href="${link}">Click here</a>
  </html>`;
};
