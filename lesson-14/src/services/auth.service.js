import * as fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

import bcrypt from 'bcrypt';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

import { User } from '../models/user.model.js';
import { Session } from '../models/session.model.js';

import { sendMail } from '../utils/sendMail.js';
import { getEnvVar } from '../utils/getEnvVar.js';

const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
  path.resolve('src', 'templates', 'reset-password.hbs'),
  'UTF-8',
);

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });

  if (user !== null) {
    throw new createHttpError.Conflict('Email is already in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch !== true) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}

export async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findOne({ _id: sessionId });

  if (session === null) {
    throw new createHttpError.Unauthorized('Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw new createHttpError.Unauthorized('Refresh token is invalid');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized('Refresh token is expired');
  }

  await Session.deleteOne({ _id: session._id });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}

export async function requestResetPassword(email) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw new createHttpError.NotFound('User not found');
  }

  const token = jwt.sign(
    {
      sub: user._id,
      name: user.name,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const template = Handlebars.compile(RESET_PASSWORD_TEMPLATE);

  await sendMail(
    user.email,
    'Reset password',
    template({ link: `http://localhost:3000/reset-password/?token=${token}` }),
  );
}

export async function resetPassword(password, token) {
  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));

    const user = await User.findById(decoded.sub);

    if (user === null) {
      throw new createHttpError.NotFound('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new createHttpError.Unauthorized('Token is unauthorized');
    }

    if (error.name === 'TokenExpiredError') {
      throw new createHttpError.Unauthorized('Token is expired');
    }

    throw error;
  }
}

export async function loginOrRegister(email, name) {
  let user = await User.findOne({ email });

  if (user === null) {
    const password = await bcrypt.hash(
      crypto.randomBytes(30).toString('base64'),
      10,
    );

    user = await User.create({ name, email, password });
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}
