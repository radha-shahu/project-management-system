import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  status: number;
  data?: T;
  error?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.checkStoredAuth();
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    // Mock login - check against hardcoded users
    const mockUsers = [
      { id: 1, email: 'admin@example.com', password: 'password123', name: 'Admin User', role: 'admin' },
      { id: 2, email: 'user@example.com', password: 'password123', name: 'Regular User', role: 'user' }
    ];

    const user = mockUsers.find(u =>
      u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      const token = this.generateToken();
      const response: LoginResponse = { user: userWithoutPassword, token };

      // Store auth data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('current_user', JSON.stringify(userWithoutPassword));

      this.currentUserSubject.next(userWithoutPassword);
      this.isAuthenticatedSubject.next(true);

      // Return success response with 200 status
      return of({
        status: 200,
        data: response,
        message: 'Login successful'
      }).pipe(delay(1000)); // Simulate API delay
    } else {
      // Return error response with 401 status
      return throwError(() => ({
        status: 401,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      }));
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private checkStoredAuth(): void {
    const token = this.getToken();
    const userStr = localStorage.getItem('current_user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  private generateToken(): string {
    return 'mock-jwt-token-' + Date.now();
  }
}
