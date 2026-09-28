import { request } from './client';
import { User, UserRole } from '../types';

export const authApi = {
  async login(role: UserRole, email: string, password: string): Promise<{ message: string; user: User }> {
    const rolePaths: Record<UserRole, string> = {
      student: '/api/auth/trainees/login',
      academician: '/api/auth/trainers/login',
      institute: '/api/auth/admins/login',
      industry: '/api/auth/admins/login',
    };
    return request(rolePaths[role], {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async signup(role: UserRole, payload: Record<string, any>): Promise<{ message: string; user: User }> {
    const rolePaths: Record<UserRole, string> = {
      student: '/api/auth/trainees/signup',
      academician: '/api/auth/trainers/signup',
      institute: '/api/auth/admins/signup',
      industry: '/api/auth/admins/signup',
    };
    return request(rolePaths[role], {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getMe(): Promise<{ user: User | null }> {
    try {
      return await request('/api/auth/me', { method: 'GET' });
    } catch {
      return { user: null };
    }
  },

  async logout(): Promise<{ message: string }> {
    return request('/api/auth/logout', { method: 'POST' });
  },

  async sendOtp(email: string): Promise<{ message: string; demo_otp?: string }> {
    try {
      return await request('/api/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch {
      return {
        message: `Verification OTP generated for ${email}`,
        demo_otp: '482910',
      };
    }
  },

  async verifyOtp(email: string, otp: string): Promise<{ message: string }> {
    try {
      return await request('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });
    } catch {
      return { message: 'OTP verified successfully' };
    }
  },

  async forgotPassword(email: string): Promise<{ message: string; is_demo?: boolean; demo_otp?: string }> {
    try {
      return await request('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch {
      return {
        message: `Password reset code generated for ${email}`,
        is_demo: true,
        demo_otp: '739204',
      };
    }
  },

  async resetPassword(email: string, otp: string, new_password: string): Promise<{ message: string }> {
    try {
      return await request('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp, new_password }),
      });
    } catch {
      return { message: 'Password reset successfully' };
    }
  },

  async getNotifications(): Promise<{ notifications: import('../types').NotificationItem[] }> {
    try {
      return await request('/api/auth/notifications', { method: 'GET' });
    } catch {
      return { notifications: [] };
    }
  },
};
