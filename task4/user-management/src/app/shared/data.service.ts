import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
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
    const url = `${backend}/auth/users/${userId}/block`;
    return this.http.put(url, null);
  }

  deleteUser(userId: string): Observable<any> {
    const url = `${backend}/auth/users/${userId}/delete`;
    return this.http.delete(url).pipe(
      catchError((error) => {
        console.error('Error deleting user:', error);
        // You can handle the error here (e.g., show an error message)
        return of({}); // Return an empty object to handle the error
      })
    );
  }
  blockUsers(userIds: string[]) {
    return this.http.put(`${backend}/auth/users/block`, null, {
      params: { userIds: userIds.join(',') }
    });
  }
  unblockUsers(userIds: string[]) {
    return this.http.put(`${backend}/auth/users/unblock`, null, {
      params: { userIds: userIds.join(',') }
    });
  }
}
