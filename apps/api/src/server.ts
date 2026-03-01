import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { z } from "zod";

import { clearAdminCookie, isValidAdminLogin, issueAdminCookie, readAdminToken, requireAdmin } from "./auth.js";
import { config } from "./config.js";
import {
  buildAdminOverview,
  createOrder,
  createTryOnRequest,
  getProductBySlug,
  homeTryOnConfig,
  lensPackages,
  listOrders,
  listProducts,
  listTryOnRequests,
  storefrontContent,
} from "./data.js";

const app = express();

const tryOnRequestSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(7),
  city: z.string().min(2),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  preferredSlot: z.string().min(3),
  notes: z.string().optional(),
  selectedFrameIds: z.array(z.string()).min(homeTryOnConfig.minimumFrames),
});

const createOrderSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(7),
  city: z.string().min(2),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  notes: z.string().optional(),
  prescriptionMode: z.enum(["manual", "upload_later", "none"]),
  prescriptionSummary: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(5),
        lensPackageId: z.string().optional(),
        requiresPrescription: z.boolean(),
      }),
    )
    .min(1),
});

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_request, response) => {
  response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "studio-vision-api",
  });
});

app.get("/api/storefront", (_request, response) => {
  response.json({
    storefront: storefrontContent,
    homeTryOn: homeTryOnConfig,
    featuredProducts: listProducts().filter((product) => product.featured).slice(0, 6),
  });
});

app.get("/api/products", (request, response) => {
  const category = typeof request.query.category === "string" ? request.query.category : undefined;
  const mode = typeof request.query.mode === "string" ? request.query.mode : undefined;

  let data = listProducts(category);

  if (mode === "try-on") {
    data = data.filter((product) => product.tryOnEligible);
  }

  response.json({ products: data });
});

app.get("/api/products/:slug", (request, response) => {
  const product = getProductBySlug(request.params.slug);

  if (!product) {
    response.status(404).json({ message: "Product not found." });
    return;
  }

  response.json({ product });
});

app.get("/api/lens-packages", (_request, response) => {
  response.json({ lensPackages });
});

app.get("/api/home-try-on/config", (_request, response) => {
  response.json({ config: homeTryOnConfig });
});

app.post("/api/home-try-on/requests", (request, response) => {
  const parsed = tryOnRequestSchema.safeParse(request.body);

  if (!parsed.success) {
    response.status(400).json({
      message: "Invalid try-at-home request.",
      issues: parsed.error.flatten(),
    });
    return;
  }

  const invalidFrames = parsed.data.selectedFrameIds.filter((frameId) => {
    const frame = listProducts().find((product) => product.id === frameId);
    return !frame || !frame.tryOnEligible;
  });

  if (invalidFrames.length > 0) {
    response.status(400).json({
      message: "Some selected frames are not eligible for try-at-home.",
      invalidFrames,
    });
    return;
  }

  const created = createTryOnRequest(parsed.data);
  response.status(201).json({ request: created });
});

app.post("/api/orders", (request, response) => {
  const parsed = createOrderSchema.safeParse(request.body);

  if (!parsed.success) {
    response.status(400).json({
      message: "Invalid order payload.",
      issues: parsed.error.flatten(),
    });
    return;
  }

  try {
    const order = createOrder(parsed.data);
    response.status(201).json({ order });
  } catch (error) {
    response.status(400).json({
      message: error instanceof Error ? error.message : "Unable to create order.",
    });
  }
});

app.post("/api/admin/login", (request, response) => {
  const parsed = adminLoginSchema.safeParse(request.body);

  if (!parsed.success) {
    response.status(400).json({ message: "Invalid admin login payload." });
    return;
  }

  if (!isValidAdminLogin(parsed.data.email, parsed.data.password)) {
    response.status(401).json({ message: "Invalid admin credentials." });
    return;
  }

  issueAdminCookie(response);
  response.json({
    session: {
      authenticated: true,
      adminName: config.adminName,
      email: config.adminEmail,
    },
  });
});

app.post("/api/admin/logout", (_request, response) => {
  clearAdminCookie(response);
  response.status(204).send();
});

app.get("/api/admin/session", (request, response) => {
  const admin = readAdminToken(request);

  if (!admin) {
    response.json({ session: { authenticated: false } });
    return;
  }

  response.json({
    session: {
      authenticated: true,
      adminName: admin.name,
      email: admin.email,
    },
  });
});

app.get("/api/admin/overview", requireAdmin, (_request, response) => {
  response.json({ overview: buildAdminOverview() });
});

app.get("/api/admin/orders", requireAdmin, (_request, response) => {
  response.json({ orders: listOrders() });
});

app.get("/api/admin/try-on-requests", requireAdmin, (_request, response) => {
  response.json({ tryOnRequests: listTryOnRequests() });
});

app.use((_request, response) => {
  response.status(404).json({ message: "Route not found." });
});

app.listen(config.port, () => {
  console.log(`Studio Vision API listening on http://localhost:${config.port}`);
});
