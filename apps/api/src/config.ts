import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 4000),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET ?? "local-dev-secret-change-me",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@opticaldemo.local",
  adminPassword: process.env.ADMIN_PASSWORD ?? "change-this-before-production",
  adminName: "Studio Vision Admin",
};
