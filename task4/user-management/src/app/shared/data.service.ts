import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private backend = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getData(){
    return this.http.get(`${this.backend}/auth/users`)
  }
}
