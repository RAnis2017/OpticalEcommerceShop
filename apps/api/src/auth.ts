import { timingSafeEqual } from "node:crypto";

import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

import { config } from "./config.js";

const COOKIE_NAME = "studio_vision_admin";

interface AdminTokenPayload {
  email: string;
  name: string;
}

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function isValidAdminLogin(email: string, password: string): boolean {
  return safeCompare(email, config.adminEmail) && safeCompare(password, config.adminPassword);
}

export function issueAdminCookie(response: Response): void {
  const token = jwt.sign(
    {
      email: config.adminEmail,
      name: config.adminName,
    } satisfies AdminTokenPayload,
    config.jwtSecret,
    { expiresIn: "8h" },
  );

  response.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 8 * 60 * 60 * 1000,
  });
}

export function clearAdminCookie(response: Response): void {
  response.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
}

export function readAdminToken(request: Request): AdminTokenPayload | null {
  const token = request.cookies[COOKIE_NAME];

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, config.jwtSecret) as AdminTokenPayload;
  } catch {
    return null;
  }
}

export function requireAdmin(request: Request, response: Response, next: NextFunction): void {
  const admin = readAdminToken(request);

  if (!admin) {
    response.status(401).json({ message: "Admin authentication required." });
    return;
  }

  response.locals.admin = admin;
  next();
}
