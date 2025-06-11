import express from 'express';

import { validateBody } from '../middlewares/validateBody.js';

import {
  registerSchema,
  loginSchema,
  requestResetPasswordSchema,
  resetPasswordSchema,
  confirmOAuthSchema,
} from '../validation/auth.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  registerController,
  loginController,
  logoutController,
  refreshController,
  requestResetPasswordController,
  resetPasswordController,
  getOAuthController,
  confirmOAuthController,
} from '../controllers/auth.controller.js';

const router = express.Router();
const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

router.post(
  '/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(loginController),
);

router.post('/logout', ctrlWrapper(logoutController));

router.post('/refresh', ctrlWrapper(refreshController));

router.post(
  '/request-reset-password',
  jsonParser,
  validateBody(requestResetPasswordSchema),
  ctrlWrapper(requestResetPasswordController),
);

router.post(
  '/reset-password',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

router.get('/get-oauth-url', ctrlWrapper(getOAuthController));

router.post(
  '/confirm-oauth',
  jsonParser,
  validateBody(confirmOAuthSchema),
  ctrlWrapper(confirmOAuthController),
);

export default router;
