import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api'; // Will be mocked with localStorage

  constructor(private http: HttpClient) { }

  // Mock API methods using localStorage
  get<T>(endpoint: string, params?: HttpParams): Observable<ApiResponse<T>> {
    return this.mockRequest<T>(() => this.getFromStorage<T>(endpoint));
  }

  post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.mockRequest<T>(() => this.saveToStorage<T>(endpoint, data));
  }

  put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.mockRequest<T>(() => this.updateInStorage<T>(endpoint, data));
  }

  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.mockRequest<T>(() => this.deleteFromStorage<T>(endpoint));
  }

  private mockRequest<T>(operation: () => T): Observable<ApiResponse<T>> {
    return of(operation()).pipe(
      delay(500), // Simulate network delay
      map(result => ({
        data: result,
        success: true,
        message: 'Operation successful'
      })),
      catchError(error => {
        console.error('API Error:', error);
        return of({
          success: false,
          message: error.message || 'An error occurred'
        });
      })
    );
  }

  private getFromStorage<T>(endpoint: string): T {
    const key = this.getStorageKey(endpoint);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  private saveToStorage<T>(endpoint: string, data: any): T {
    const key = this.getStorageKey(endpoint);
    const existingData = this.getFromStorage<T[]>(endpoint) || [];
    const newItem = { ...data, id: Date.now() };
    const updatedData = [...existingData, newItem];
    localStorage.setItem(key, JSON.stringify(updatedData));
    return newItem as T;
  }

  private updateInStorage<T>(endpoint: string, data: any): T {
    const key = this.getStorageKey(endpoint);
    const existingData = this.getFromStorage<T[]>(endpoint) || [];
    const updatedData = existingData.map((item: any) =>
      item.id === data.id ? { ...item, ...data } : item
    );
    localStorage.setItem(key, JSON.stringify(updatedData));
    return data as T;
  }

  private deleteFromStorage<T>(endpoint: string): T {
    const key = this.getStorageKey(endpoint);
    localStorage.removeItem(key);
    return null as T;
  }

  private getStorageKey(endpoint: string): string {
    return endpoint.replace('/api/', '');
  }
}
