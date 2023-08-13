import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { DataService } from '../shared/data.service';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];

  constructor(private authService:AuthService, private router:Router, private dataService:DataService){}

  ngOnInit(): void {
    this.getUsers();
  }
  getUsers() {
    this.dataService.fetchUsers().subscribe(
      (users: any[]) => {
        this.users = users;
        console.log(this.users) // Assign the received array directly
      },
      (error) => {
        // Handle error (e.g., show an error message)
      }
    );
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
  blockUser(userId: string) {
    this.dataService.blockUser(userId).subscribe(
      () => {
        // Handle success (e.g., update UI or show a success message)
      },
      (error) => {
        // Handle error (e.g., show an error message)
      }
    );
  }
}
