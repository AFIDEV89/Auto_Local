"use strict";

export const emailValidator = (email) => {
    try {
        const format = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return email.match(format);
    } catch (error) {
        return false;
    }
};

export const passwordValidator = (password) => {
    try {
        const format = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})");
        return password.match(format);
    } catch (error) {
        return false;
    }
};

export const contactNoValidator = (number) => {
    try {
        const format = new RegExp(/^[0-9]{10}$/);
        return number.match(format);
    } catch (error) {
        return false;
    }
};
