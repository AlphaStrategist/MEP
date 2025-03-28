import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RefreshTokenRequestDto, RefreshTokenResponseDto } from './refresh_token_dto';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) { }

  autoLogin(): void {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      return;
    }
    const expiryStr = localStorage.getItem('tokenExpiry');
    if (expiryStr) {
      const now = Math.floor(Date.now() / 1000);
      const expiry = parseInt(expiryStr, 10);
      if (now > expiry) {
        this.logout();
        return;
      }
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserName(): string {
    const userData = localStorage.getItem('user');
    if (!userData) return '';
    const user = JSON.parse(userData);
    return user.name;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
  }

  isAdmin(): boolean {
    const userData = localStorage.getItem('user');
    if (!userData) return false;
    const user = JSON.parse(userData);
    return user.role === 'admin';
  }

  refreshToken(): Observable<RefreshTokenResponseDto> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const dto: RefreshTokenRequestDto = { refreshToken };
    return this.http.post<RefreshTokenResponseDto>('http://localhost:8000/api/auth/refresh', dto);
  }
}
