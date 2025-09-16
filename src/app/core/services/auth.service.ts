import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators'; // rxjs operator to simulate network delay

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

  private currentUser: User | null = null;
  private isAuthenticatedFlag: boolean = false;

  constructor() {
    // check if user is already logged in when service starts
    this.checkStoredAuth();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // login method
  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    console.log('AuthService: Attempting login for:', credentials.email);

    // step 1: define our test users(mock data)
    const testUsers = [
      { id: 1, email: 'admin@example.com', password: 'password123', name: 'Admin User', role: 'admin' },
      { id: 2, email: 'user@example.com', password: 'password123', name: 'Regular User', role: 'user' }
    ];

    // step 2: find matching user
    const foundUser = testUsers.find(user =>
      user.email === credentials.email && user.password === credentials.password
    );

    if (foundUser) {
      console.log('AuthService: Login successful for:', foundUser.name);

      // step 3: remove password from user data (security best practice)
      const { password, ...safeUserData } = foundUser;

      // step 4: generate a simple token
      const token = this.generateToken();

      // step 5: store user data in browser storage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('current_user', JSON.stringify(safeUserData));

      // step 6: update our service properties
      this.currentUser = safeUserData;
      this.isAuthenticatedFlag = true;

      // step 7: return success response
      const response: LoginResponse = { user: safeUserData, token };
      return of({
        status: 200,
        data: response,
        message: 'Login successful'
      }).pipe(delay(1000)); // simulate network delay
    } else {
      console.log('AuthService: Login failed - invalid credentials');
      return throwError(() => ({
        status: 401,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      }));
    }
  }

  // logout method
  logout(): void {
    console.log('AuthService: Logging out user');

    // clear browser storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');

    // reset service properties
    this.currentUser = null;
    this.isAuthenticatedFlag = false;
  }

  // get the stored token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // check if user is authenticated
  isAuthenticated(): boolean {
    return this.isAuthenticatedFlag;
  }

  // check if user data is stored in browser when service starts
  private checkStoredAuth(): void {
    console.log('AuthService: Checking for stored authentication...');

    const token = this.getToken();
    const userDataString = localStorage.getItem('current_user');

    if (token && userDataString) {
      try {
        // parse the stored user data
        const user = JSON.parse(userDataString);

        // set our service properties
        this.currentUser = user;
        this.isAuthenticatedFlag = true;

        console.log('AuthService: Found stored authentication for:', user.name);
      } catch (error) {
        console.log('AuthService: Error parsing stored user data, logging out');
        this.logout();
      }
    } else {
      console.log('AuthService: No stored authentication found');
    }
  }

  // generate a simple token (in real app, this would be done by the server)
  private generateToken(): string {
    return 'mock-jwt-token-' + Date.now();
  }
}
