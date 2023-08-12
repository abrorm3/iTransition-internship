import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backend } from '../app.backend';
import { AuthRequest, AuthResponse } from './auth.model';
import { Observable, catchError, map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${backend}/auth/login`, credentials)
      .pipe(
        catchError(this.handleError),
        map(response => {
          if (response.token) {
            this.setAuthToken(response.token); // Store the token in local storage
          }
          return response;
        })
      );
  }

  signup(credentials:AuthRequest){
    return this.http.post<AuthResponse>(`${backend}/auth/registration`, credentials)
    .pipe(
      catchError(this.handleError)
    )
  }
  logout(){
    this.removeAuthToken();
  }
  setAuthToken(token: string): void {
    localStorage.setItem('user', token);
  }

  removeAuthToken(): void {
    localStorage.removeItem('user');
  }

  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('user');
    const authenticated = !!token;
    return of(authenticated);
  }
  // checkAuthStatus(): Observable<boolean> {
  //   const token = localStorage.getItem('token'); // Assume you're storing the token in local storage after login
  //   if (!token) {
  //     return of(false);
  //   }

  //   return this.http.get<boolean>(`${backend}/auth/check-auth-status`, {
  //     headers: { Authorization: token }
  //   }).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  private handleError(errorRes: HttpErrorResponse){
    let errorMessage = 'An unknown error occurred!';
    if (errorRes.error && errorRes.error.message) {
      errorMessage = errorRes.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
