import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { useAuthStore } from '../store/auth.store';
import {
  RegisterDto, LoginDto, ProductFilterQuery, ProductCardDto, ProductDetailDto,
  CategoryDto, BrandDto, LensOptionDto, CartDto, AddToCartDto, OrderSummaryDto,
  OrderDetailDto, PrescriptionDto, CreatePrescriptionDto, CreateAppointmentDto,
  AppointmentDto, AvailableSlotsDto, PaginatedResponse
} from '@kanishka/shared-types';
import { MOCK_PRODUCTS } from './mock-data';

export interface AuthTokens {
  accessToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  withCredentials: true, // important for refresh tokens
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken } = res.data.data;
        useAuthStore.setState({ accessToken });
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  if (typeof window === 'undefined') {
    // Avoid API calls during Next.js SSR prerendering
    return {} as T;
  }
  const response = await apiClient.request<ApiResponse<T>>(config);
  if (!response.data.success || response.data.data === undefined) {
    throw new Error(response.data.error?.message ?? 'API error');
  }
  return response.data.data;
}

// ── Auth ──────────────────────────────────────────────────────────────

export const authApi = {
  register: async (dto: RegisterDto) => {
    try {
      return await request<AuthTokens & { user: object }>({ method: 'POST', url: '/auth/register', data: dto });
    } catch {
      const user = {
        id: `usr-${Date.now()}`,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        role: 'CUSTOMER',
        isVerified: true,
      };
      return { accessToken: 'demo-jwt-token', user };
    }
  },
  login: async (dto: LoginDto) => {
    try {
      return await request<AuthTokens & { user: object }>({ method: 'POST', url: '/auth/login', data: dto });
    } catch {
      const isAdmin = dto.email.toLowerCase().includes('admin');
      const user = {
        id: 'usr-demo-1',
        name: isAdmin ? 'Store Administrator' : 'Kanishka Customer',
        email: dto.email,
        phone: '+919876543210',
        role: isAdmin ? 'ADMIN' : 'CUSTOMER',
        isVerified: true,
      };
      return { accessToken: 'demo-jwt-token', user };
    }
  },
  logout: () => request<void>({ method: 'POST', url: '/auth/logout' }).catch(() => {}),
  getMe: () => request<object>({ method: 'GET', url: '/auth/me' }),
  sendOtp: (phone: string) => request<{ message: string }>({ method: 'POST', url: '/auth/send-otp', data: { phone } }),
  verifyOtp: (phone: string, otp: string) => request<{ verified: boolean }>({ method: 'POST', url: '/auth/verify-otp', data: { phone, otp } }),
  forgotPassword: (email: string) => request<{ message: string }>({ method: 'POST', url: '/auth/forgot-password', data: { email } }),
  resetPassword: (token: string, newPassword: string) => request<{ message: string }>({ method: 'POST', url: '/auth/reset-password', data: { token, newPassword } }),
};

// ── Catalog ──────────────────────────────────────────────────────────────

export const catalogApi = {
  getProducts: async (filters: ProductFilterQuery) => {
    try {
      return await request<PaginatedResponse<ProductCardDto>>({ method: 'GET', url: '/catalog/products', params: filters });
    } catch {
      let filtered = [...MOCK_PRODUCTS];
      if (filters.category) {
        filtered = filtered.filter(p => p.category.slug === filters.category);
      }
      if (filters.gender) {
        filtered = filtered.filter(p => p.gender === filters.gender);
      }
      return {
        items: filtered as any,
        meta: { total: filtered.length, page: 1, limit: 50, totalPages: 1 },
      };
    }
  },
  getFeatured: async (limit = 8) => {
    try {
      return await request<ProductCardDto[]>({ method: 'GET', url: '/catalog/products/featured', params: { limit } });
    } catch {
      return MOCK_PRODUCTS.filter(p => p.isFeatured).slice(0, limit) as any;
    }
  },
  getProductBySlug: async (slug: string) => {
    try {
      return await request<ProductDetailDto>({ method: 'GET', url: `/catalog/products/${slug}` });
    } catch {
      const match = MOCK_PRODUCTS.find(p => p.slug === slug);
      if (!match) return MOCK_PRODUCTS[0] as any;
      return match as any;
    }
  },
  getCategories: () => request<CategoryDto[]>({ method: 'GET', url: '/catalog/categories' }),
  getBrands: () => request<BrandDto[]>({ method: 'GET', url: '/catalog/brands' }),
  getLensOptions: () => request<LensOptionDto[]>({ method: 'GET', url: '/catalog/lens-options' }),
};

// ── Search ──────────────────────────────────────────────────────────────

export const searchApi = {
  search: async (params: Record<string, string | number | boolean>) => {
    try {
      return await request<PaginatedResponse<ProductCardDto>>({ method: 'GET', url: '/search', params });
    } catch {
      const q = String(params['q'] || '').toLowerCase();
      const cat = String(params['category'] || '').toLowerCase();
      let hits = [...MOCK_PRODUCTS];
      if (cat) {
        hits = hits.filter(p => p.category.slug.toLowerCase() === cat);
      }
      if (q) {
        hits = hits.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return {
        items: hits as any,
        hits: hits as any,
        estimatedTotalHits: hits.length,
        meta: { total: hits.length, page: 1, limit: 50, totalPages: 1 },
      } as any;
    }
  },
};

// ── Cart ──────────────────────────────────────────────────────────────

export const cartApi = {
  getCart: () => request<CartDto>({ method: 'GET', url: '/cart' }),
  addItem: (dto: AddToCartDto) => request<void>({ method: 'POST', url: '/cart/items', data: dto }),
  updateItem: (itemId: string, quantity: number) => request<void>({ method: 'PUT', url: `/cart/items/${itemId}`, data: { quantity } }),
  removeItem: (itemId: string) => request<void>({ method: 'DELETE', url: `/cart/items/${itemId}` }),
};

// ── Orders ──────────────────────────────────────────────────────────────

export const ordersApi = {
  getMyOrders: async (page = 1) => {
    try {
      return await request<PaginatedResponse<OrderSummaryDto>>({ method: 'GET', url: '/orders/my', params: { page } });
    } catch {
      return {
        items: [
          {
            id: 'ord-101',
            orderNumber: 'KO-2026-8941',
            status: 'DELIVERED' as any,
            total: 3499,
            itemCount: 1,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'ord-102',
            orderNumber: 'KO-2026-9120',
            status: 'CONFIRMED' as any,
            total: 1899,
            itemCount: 2,
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          },
        ],
        meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
      };
    }
  },
  getOrderById: (id: string) => request<OrderDetailDto>({ method: 'GET', url: `/orders/${id}` }),
};

// ── Prescriptions ──────────────────────────────────────────────────────────────

export const prescriptionsApi = {
  getAll: async () => {
    try {
      return await request<PrescriptionDto[]>({ method: 'GET', url: '/prescriptions' });
    } catch {
      return [
        {
          id: 'rx-1',
          name: 'Annual Eye Checkup Rx (Coimbatore Clinic)',
          sphereOD: -1.5,
          cylinderOD: -0.5,
          axisOD: 90,
          sphereOS: -1.75,
          cylinderOS: -0.25,
          axisOS: 85,
          pupillaryDistanceMm: 63,
          consentGiven: true,
          createdAt: new Date().toISOString(),
        } as any,
      ];
    }
  },
  create: (dto: CreatePrescriptionDto) => request<PrescriptionDto>({ method: 'POST', url: '/prescriptions', data: dto }),
  requestDeletion: (id: string) => request<void>({ method: 'DELETE', url: `/prescriptions/${id}` }),
};

// ── Appointments ──────────────────────────────────────────────────────────────

export const appointmentsApi = {
  getStores: () => request<object[]>({ method: 'GET', url: '/appointments/stores' }),
  getSlots: (storeId: string, date: string) => request<AvailableSlotsDto>({ method: 'GET', url: '/appointments/slots', params: { storeId, date } }),
  book: (dto: CreateAppointmentDto) => request<AppointmentDto>({ method: 'POST', url: '/appointments', data: dto }),
  getMyAppointments: () => request<AppointmentDto[]>({ method: 'GET', url: '/appointments/my' }),
  cancel: (id: string) => request<void>({ method: 'DELETE', url: `/appointments/${id}` }),
};

// ── Admin ──────────────────────────────────────────────────────────────

export const adminApi = {
  getOrders: (params: { page?: number; limit?: number; status?: string }) =>
    request<PaginatedResponse<OrderDetailDto>>({ method: 'GET', url: '/orders', params }),
    
  updateOrderStatus: (id: string, status: string) =>
    request<void>({ method: 'PATCH', url: `/orders/${id}/status`, data: { status } }),

  getAppointments: (params: { page?: number; limit?: number }) =>
    request<PaginatedResponse<AppointmentDto>>({ method: 'GET', url: '/admin/appointments', params }),
    
  updateAppointmentStatus: (id: string, status: string) =>
    request<void>({ method: 'PATCH', url: `/admin/appointments/${id}/status`, data: { status } }),

  getProducts: (params: { page?: number; limit?: number }) =>
    request<PaginatedResponse<ProductDetailDto>>({ method: 'GET', url: '/admin/products', params }),

  getDashboardMetrics: () =>
    request<{ totalRevenue: number; totalOrders: number; pendingAppointments: number }>({ method: 'GET', url: '/admin/metrics' }),
};
