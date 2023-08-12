import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backend } from '../app.backend';
import { AuthRequest, AuthResponse } from './auth.model';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: AuthRequest){
    return this.http.post<AuthResponse>(`${backend}/auth/login`, credentials)
    .pipe(
      catchError(this.handleError)
    )
  }
  signup(credentials:AuthRequest){
    return this.http.post<AuthResponse>(`${backend}/auth/registration`, credentials)
    .pipe(
      catchError(this.handleError)
    )
  }

  private handleError(errorRes: HttpErrorResponse){
    let errorMessage = 'An unknown error occurred!';
    if (errorRes.error && errorRes.error.message) {
      errorMessage = errorRes.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
