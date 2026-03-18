"use strict";
import bcrypt from 'bcryptjs';

export const getHash = async (password) => {
  return await bcrypt.hash(password, 10);
}

export const comparePassword = async ({ hash, password }) => {
  return await bcrypt.compare(password, hash)
}

