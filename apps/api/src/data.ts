import type {
  AdminOverview,
  CreateOrderInput,
  HomeTryOnConfig,
  LensPackage,
  Order,
  Product,
  StorefrontContent,
  TryOnRequest,
  TryOnRequestInput,
  TryOnRequestProduct,
} from "@optical/shared";

export const storefrontContent: StorefrontContent = {
  brandName: "Studio Vision",
  heroTitle: "Eyewear that looks right at home before it ever reaches the counter.",
  heroSubtitle:
    "Choose your frames, add your lenses, or send a curated try-at-home set to your door before you commit.",
  serviceHighlights: [
    "Cash on delivery across the full order journey",
    "Frame-only, prescription, and home try-on services",
    "In-home selection before final lens fitting",
  ],
  featuredCollections: [
    {
      id: "workday-acetates",
      title: "Workday Acetates",
      description: "Clean silhouettes for long screen hours and blue-light packages.",
      slug: "workday-acetates",
    },
    {
      id: "light-titanium",
      title: "Light Titanium",
      description: "Refined frames for all-day comfort with low bridge options.",
      slug: "light-titanium",
    },
    {
      id: "sun-edit",
      title: "Tinted Sun Edit",
      description: "Prescription-ready sunglasses with polarized support.",
      slug: "tinted-sun-edit",
    },
  ],
  stats: [
    { label: "Frames ready for home try-on", value: "12" },
    { label: "Prescription lens packages", value: "3" },
    { label: "Lens fitting turnaround", value: "48 hrs" },
  ],
};

export const homeTryOnConfig: HomeTryOnConfig = {
  minimumFrames: 10,
  serviceFee: 500,
  currencyCode: "INR",
};

export const lensPackages: LensPackage[] = [
  {
    id: "lens-essential",
    name: "Essential Vision",
    price: 1200,
    description: "Single vision lenses with anti-scratch coating.",
    features: ["Single vision", "Anti-scratch", "Lightweight index"],
    recommendedFor: "Daily prescription use",
  },
  {
    id: "lens-screen",
    name: "Screen Comfort",
    price: 1800,
    description: "Blue-filter lenses with anti-glare finish.",
    features: ["Blue light filter", "Anti-glare", "Single vision"],
    recommendedFor: "Laptop-heavy routines",
  },
  {
    id: "lens-progressive",
    name: "Progressive Plus",
    price: 4200,
    description: "Premium progressive lenses with smoother transitions.",
    features: ["Progressive", "Anti-glare", "Hydrophobic finish"],
    recommendedFor: "Multi-distance prescription wearers",
  },
];

const defaultImages = {
  olive:
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
  chai:
    "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=80",
  midnight:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
  crystal:
    "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1200&q=80",
  metal:
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80",
  rosewood:
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
  wire:
    "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1200&q=80",
  aviator:
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80",
  studio:
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
  portrait:
    "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1200&q=80",
  shelf:
    "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1200&q=80",
};

function gallery(...images: string[]): string[] {
  return images;
}

function buildProduct(
  overrides: Partial<Product> &
    Pick<Product, "id" | "slug" | "name" | "subtitle" | "description" | "price" | "shape" | "images">,
): Product {
  return {
    brand: "Studio Vision",
    category: "eyeglasses",
    material: "Acetate",
    size: "M",
    colors: ["Jet Black"],
    tags: ["optical"],
    features: ["Comfort bridge", "Spring hinges", "Prescription ready"],
    lensCompatibility: ["single vision", "blue light", "progressive"],
    measurement: { lensWidth: 52, bridgeWidth: 18, templeLength: 145 },
    tryOnEligible: true,
    featured: false,
    saleStock: 18,
    tryOnStock: 4,
    prescriptionSupported: true,
    ...overrides,
  };
}

export const products: Product[] = [
  buildProduct({
    id: "frame-01",
    slug: "aero-line-matte-olive",
    name: "Aero Line",
    subtitle: "Matte olive rectangle with low-bridge comfort fit.",
    description: "A lightweight rectangular frame built for long workdays.",
    price: 3499,
    shape: "Rectangle",
    featured: true,
    colors: ["Matte Olive", "Jet Black"],
    tags: ["low bridge", "screen-ready", "unisex"],
    images: gallery(defaultImages.olive, defaultImages.studio, defaultImages.shelf),
  }),
  buildProduct({
    id: "frame-02",
    slug: "harbor-round-chai",
    name: "Harbor Round",
    subtitle: "Rounded acetate frame in warm chai with slim temples.",
    description: "Soft round lines for readers and everyday wear.",
    price: 3299,
    shape: "Round",
    size: "S",
    colors: ["Chai Tortoise", "Soft Amber"],
    images: gallery(defaultImages.chai, defaultImages.portrait, defaultImages.studio),
  }),
  buildProduct({
    id: "frame-03",
    slug: "atlas-square-midnight",
    name: "Atlas Square",
    subtitle: "Statement square frame in polished midnight acetate.",
    description: "A sharper silhouette for stronger prescriptions and office wear.",
    price: 3899,
    shape: "Square",
    size: "L",
    images: gallery(defaultImages.midnight, defaultImages.studio, defaultImages.olive),
  }),
  buildProduct({
    id: "frame-04",
    slug: "linen-hex-crystal",
    name: "Linen Hex",
    subtitle: "Crystal hexagonal frame with thin edges and subtle shine.",
    description: "A refined geometric frame that stays light on the face.",
    price: 3699,
    shape: "Hexagonal",
    featured: true,
    colors: ["Crystal", "Smoke"],
    lensCompatibility: ["single vision", "blue light"],
    images: gallery(defaultImages.crystal, defaultImages.portrait, defaultImages.shelf),
  }),
  buildProduct({
    id: "frame-05",
    slug: "foundry-metal-gunmetal",
    name: "Foundry Metal",
    subtitle: "Gunmetal frame tuned for lightness and durable hinges.",
    description: "A quiet professional frame with adjustable nose pads.",
    price: 4299,
    shape: "Rectangle",
    material: "Titanium blend",
    colors: ["Gunmetal", "Satin Silver"],
    images: gallery(defaultImages.metal, defaultImages.studio, defaultImages.aviator),
  }),
  buildProduct({
    id: "frame-06",
    slug: "bay-cat-eye-rosewood",
    name: "Bay Cat-Eye",
    subtitle: "Rosewood cat-eye frame with softened edges.",
    description: "A balanced cat-eye silhouette with depth for modern lenses.",
    price: 3599,
    shape: "Cat eye",
    featured: true,
    colors: ["Rosewood", "Ink Plum"],
    lensCompatibility: ["single vision", "blue light"],
    images: gallery(defaultImages.rosewood, defaultImages.portrait, defaultImages.chai),
  }),
  buildProduct({
    id: "frame-07",
    slug: "signal-wire-bronze",
    name: "Signal Wire",
    subtitle: "Minimal bronze wire frame with classic round lens shape.",
    description: "A slim metal profile with understated presence.",
    price: 2999,
    shape: "Round",
    size: "S",
    material: "Stainless steel",
    lensCompatibility: ["single vision", "blue light"],
    images: gallery(defaultImages.wire, defaultImages.studio, defaultImages.olive),
  }),
  buildProduct({
    id: "frame-08",
    slug: "cove-soft-square-sand",
    name: "Cove Soft Square",
    subtitle: "Soft-square acetate frame in sand with narrow shoulders.",
    description: "Calm lines and stable fit for first-time prescription buyers.",
    price: 3399,
    shape: "Soft square",
    colors: ["Sand", "Olive Mist"],
    images: gallery(defaultImages.chai, defaultImages.shelf, defaultImages.crystal),
  }),
  buildProduct({
    id: "frame-09",
    slug: "marina-oval-storm",
    name: "Marina Oval",
    subtitle: "Storm blue oval frame with slim profile and polished edges.",
    description: "A compact oval for softer styling and lighter facial lines.",
    price: 3199,
    shape: "Oval",
    size: "S",
    lensCompatibility: ["single vision", "blue light"],
    images: gallery(defaultImages.olive, defaultImages.portrait, defaultImages.metal),
  }),
  buildProduct({
    id: "frame-10",
    slug: "quarry-browline-walnut",
    name: "Quarry Browline",
    subtitle: "Walnut browline frame with metal lower rim and strong fit.",
    description: "A classic browline made easier to wear with softened angles.",
    price: 4099,
    shape: "Browline",
    colors: ["Walnut", "Ink Gold"],
    images: gallery(defaultImages.midnight, defaultImages.studio, defaultImages.shelf),
  }),
  buildProduct({
    id: "frame-11",
    slug: "ridge-aviator-smoke",
    name: "Ridge Aviator",
    subtitle: "Smoked aviator sunglasses with prescription-ready lenses.",
    description: "Lightweight aviator with polarized sun option.",
    price: 4599,
    category: "sunglasses",
    shape: "Aviator",
    size: "L",
    tryOnEligible: true,
    featured: true,
    saleStock: 9,
    tryOnStock: 3,
    lensCompatibility: ["single vision", "tinted sun"],
    colors: ["Smoke", "Champagne"],
    images: gallery(defaultImages.aviator, defaultImages.studio, defaultImages.portrait),
  }),
  buildProduct({
    id: "frame-12",
    slug: "solstice-wrap-amber",
    name: "Solstice Wrap",
    subtitle: "Amber wrap sunglasses for outdoor wear and tint-ready lenses.",
    description: "Sport-driven wrap frame with single-vision sun support.",
    price: 4899,
    category: "sunglasses",
    shape: "Wrap",
    size: "L",
    material: "TR90",
    tryOnEligible: true,
    saleStock: 8,
    tryOnStock: 2,
    lensCompatibility: ["single vision", "tinted sun"],
    colors: ["Amber", "Graphite"],
    images: gallery(defaultImages.wire, defaultImages.aviator, defaultImages.shelf),
  }),
];

function toTryOnProduct(product: Product): TryOnRequestProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    image: product.images[0],
    price: product.price,
  };
}

const seededTryOnFrames = products.filter((product) => product.tryOnEligible).slice(0, 10);

let tryOnRequests: TryOnRequest[] = [
  {
    id: "tryon-1001",
    customerName: "Ayesha Khan",
    phone: "+91 99999 11111",
    city: "Lahore",
    addressLine1: "14 Mall Road",
    preferredSlot: "Tomorrow 2pm - 5pm",
    notes: "Need lighter acetate styles",
    selectedFrameIds: seededTryOnFrames.map((product) => product.id),
    selectedFrames: seededTryOnFrames.map(toTryOnProduct),
    serviceFee: homeTryOnConfig.serviceFee,
    status: "selection_pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
];

let orders: Order[] = [
  {
    id: "order-2001",
    customerName: "Hamza Rahman",
    phone: "+91 99999 22222",
    city: "Karachi",
    addressLine1: "89 Clifton Block 5",
    prescriptionMode: "manual",
    prescriptionSummary: "OD -1.25, OS -1.00, PD 63",
    status: "lens_processing",
    codAmount: 5299,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    items: [
      {
        productId: "frame-01",
        productName: "Aero Line",
        quantity: 1,
        unitPrice: 3499,
        lensPackageId: "lens-screen",
        lensPackageName: "Screen Comfort",
        lensPrice: 1800,
        lineTotal: 5299,
      },
    ],
  },
];

export function listProducts(category?: string): Product[] {
  if (!category || category === "all") {
    return products;
  }

  return products.filter((product) => product.category === category);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function createTryOnRequest(input: TryOnRequestInput): TryOnRequest {
  const selectedFrames = input.selectedFrameIds
    .map((frameId) => products.find((product) => product.id === frameId))
    .filter((product): product is Product => Boolean(product))
    .map(toTryOnProduct);

  const request: TryOnRequest = {
    ...input,
    id: `tryon-${Date.now()}`,
    status: "requested",
    createdAt: new Date().toISOString(),
    serviceFee: homeTryOnConfig.serviceFee,
    selectedFrames,
  };

  tryOnRequests = [request, ...tryOnRequests];
  return request;
}

export function listTryOnRequests(): TryOnRequest[] {
  return tryOnRequests;
}

export function createOrder(input: CreateOrderInput): Order {
  const items = input.items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId);

    if (!product) {
      throw new Error(`Unknown product: ${item.productId}`);
    }

    const lensPackage = item.lensPackageId
      ? lensPackages.find((entry) => entry.id === item.lensPackageId)
      : undefined;

    const lineTotal = (product.price + (lensPackage?.price ?? 0)) * item.quantity;

    return {
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.price,
      lensPackageId: lensPackage?.id,
      lensPackageName: lensPackage?.name,
      lensPrice: lensPackage?.price,
      lineTotal,
    };
  });

  const order: Order = {
    id: `order-${Date.now()}`,
    customerName: input.customerName,
    phone: input.phone,
    city: input.city,
    addressLine1: input.addressLine1,
    addressLine2: input.addressLine2,
    notes: input.notes,
    prescriptionMode: input.prescriptionMode,
    prescriptionSummary: input.prescriptionSummary,
    status: "pending_confirmation",
    codAmount: items.reduce((total, item) => total + item.lineTotal, 0),
    createdAt: new Date().toISOString(),
    items,
  };

  orders = [order, ...orders];
  return order;
}

export function listOrders(): Order[] {
  return orders;
}

export function buildAdminOverview(): AdminOverview {
  const revenueBooked = orders
    .filter((order) => order.status === "delivered" || order.status === "lens_processing" || order.status === "confirmed")
    .reduce((total, order) => total + order.codAmount, 0);

  const codPending = orders
    .filter((order) => order.status !== "delivered" && order.status !== "cancelled" && order.status !== "refunded")
    .reduce((total, order) => total + order.codAmount, 0);

  const convertedTryOns = tryOnRequests.filter((request) => request.status === "converted").length;
  const tryOnPending = tryOnRequests.filter(
    (request) => request.status !== "closed" && request.status !== "cancelled" && request.status !== "converted",
  ).length;

  return {
    totalOrders: orders.length,
    revenueBooked,
    refundsProcessed: 0,
    codPending,
    tryOnPending,
    tryOnConversionRate:
      tryOnRequests.length === 0 ? 0 : Number(((convertedTryOns / tryOnRequests.length) * 100).toFixed(1)),
  };
}
