export type ProductCategory = "eyeglasses" | "sunglasses" | "lenses";

export type OrderStatus =
  | "pending_confirmation"
  | "confirmed"
  | "lens_processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type TryOnRequestStatus =
  | "requested"
  | "confirmed"
  | "packed"
  | "dispatched"
  | "delivered"
  | "selection_pending"
  | "converted"
  | "returned"
  | "closed"
  | "cancelled";

export type PrescriptionMode = "manual" | "upload_later" | "none";

export interface ProductMeasurement {
  lensWidth: number;
  bridgeWidth: number;
  templeLength: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subtitle: string;
  description: string;
  material: string;
  shape: string;
  size: "S" | "M" | "L";
  price: number;
  compareAtPrice?: number;
  colors: string[];
  tags: string[];
  features: string[];
  lensCompatibility: string[];
  images: string[];
  measurement: ProductMeasurement;
  tryOnEligible: boolean;
  featured: boolean;
  saleStock: number;
  tryOnStock: number;
  prescriptionSupported: boolean;
}

export interface LensPackage {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  recommendedFor: string;
}

export interface StorefrontCollection {
  id: string;
  title: string;
  description: string;
  slug: string;
}

export interface StorefrontMetric {
  label: string;
  value: string;
}

export interface StorefrontContent {
  brandName: string;
  heroTitle: string;
  heroSubtitle: string;
  serviceHighlights: string[];
  featuredCollections: StorefrontCollection[];
  stats: StorefrontMetric[];
}

export interface HomeTryOnConfig {
  minimumFrames: number;
  serviceFee: number;
  currencyCode: string;
}

export interface TryOnRequestInput {
  customerName: string;
  phone: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  preferredSlot: string;
  notes?: string;
  selectedFrameIds: string[];
}

export interface TryOnRequestProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
}

export interface TryOnRequest extends TryOnRequestInput {
  id: string;
  status: TryOnRequestStatus;
  createdAt: string;
  serviceFee: number;
  selectedFrames: TryOnRequestProduct[];
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
  lensPackageId?: string;
  requiresPrescription: boolean;
}

export interface CreateOrderInput {
  customerName: string;
  phone: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  notes?: string;
  prescriptionMode: PrescriptionMode;
  prescriptionSummary?: string;
  items: OrderItemInput[];
}

export interface OrderLineItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lensPackageId?: string;
  lensPackageName?: string;
  lensPrice?: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  notes?: string;
  prescriptionMode: PrescriptionMode;
  prescriptionSummary?: string;
  status: OrderStatus;
  codAmount: number;
  createdAt: string;
  items: OrderLineItem[];
}

export interface AdminOverview {
  totalOrders: number;
  revenueBooked: number;
  refundsProcessed: number;
  codPending: number;
  tryOnPending: number;
  tryOnConversionRate: number;
}

export interface AdminSession {
  authenticated: boolean;
  adminName?: string;
  email?: string;
}
