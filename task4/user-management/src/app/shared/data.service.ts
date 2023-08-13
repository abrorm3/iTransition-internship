import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { backend } from '../app.backend';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }


fetchUsers(): Observable<any[]> {
  const token = localStorage.getItem('user');
  if (token) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${backend}/auth/users`, { headers });
  } else {
    console.log('Token not available.');
    return of([]);
  }
}
  blockUser(userId: string): Observable<any> {
    const url = `${backend}/users/${userId}/block`;
    return this.http.put(url, null);
  }
}
