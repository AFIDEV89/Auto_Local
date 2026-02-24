export const emailValidator = (email) => {
  const format = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
  return email.match(format);
};

export const passwordValidator = (password) => {
  const format = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})");
  return password.match(format);
};

export const mobileNumberValidator = (mobile_number) => {
  const format = /^[6-9]\d{9}$/gi;
  return mobile_number.match(format);
}
