export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  bookCount: number;
};

export type Review = {
  id: string;
  userName: string;
  userTitle: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  createdAt: string;
};

export type Book = {
  id: string;
  slug: string;
  title: string;
  author: string;
  publisher: string;
  synopsis: string;
  shortDescription: string;
  price: number;
  compareAtPrice: number | null;
  rating: number;
  reviewCount: number;
  inventory: number;
  pages: number;
  format: string;
  language: string;
  isbn: string;
  coverImage: string;
  gallery: string[];
  publishedAt: string;
  releaseLabel: string;
  location: string;
  featured: boolean;
  spotlight: boolean;
  aiSummary: string | null;
  aiTags: string[];
  categories: Array<{ name: string; slug: string }>;
  reviews?: Review[];
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  readTime: number;
  authorName: string;
  authorRole: string;
  publishedAt: string;
  featured: boolean;
};

export type CartItem = {
  id: string;
  quantity: number;
  lineTotal: number;
  book: {
    id: string;
    slug: string;
    title: string;
    author: string;
    coverImage: string;
    price: number;
    format: string;
    inventory: number;
  };
};

export type CartSummary = {
  subtotal: number;
  shippingFee: number;
  total: number;
};

export type CartResponse = {
  items: CartItem[];
  summary: CartSummary;
};

export type ShippingAddress = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
};

export type CheckoutOrder = {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
};

export type AppSession = {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: "USER" | "ADMIN" | "MANAGER";
  };
  session: {
    id: string;
    expiresAt: string;
  };
} | null;
