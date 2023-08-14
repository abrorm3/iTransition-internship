import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, of } from 'rxjs';
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

  deleteUsers(userIds: string[]) {
    const requests: Observable<any>[] = [];

    // Create an array of observables for each user ID to be deleted
    userIds.forEach(userId => {
      const url = `${backend}/auth/users/${userId}/delete`;
      requests.push(this.http.delete(url).pipe(
        catchError((error) => {
          console.error(`Error deleting user ${userId}:`, error);
          return of({}); // Return an empty object to handle the error
        })
      ));
    });
    return forkJoin(requests);
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
