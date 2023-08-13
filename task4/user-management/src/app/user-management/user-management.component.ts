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
  selectAll: boolean = false;

  constructor(private authService:AuthService, private router:Router, private dataService:DataService){}

  ngOnInit(): void {
    this.getUsers();
  }
  getUsers() {
    this.dataService.fetchUsers().subscribe(
      (users: any[]) => {
        this.users = users.map(user => ({
          ...user,
          status: user.roles.includes('BLOCK') ? 'Blocked' : 'Active', // Display status based on roles
          selected: false // Initialize selected property as false for each user
        }));
        console.log(this.users); // Assign the updated users array
      },
      (error) => {
        // Handle error (e.g., show an error message)
      }
    );
  }

  selectAllChanged() {
    this.selectAll = !this.selectAll; // Toggle the selectAll property

    for (const user of this.users) {
      user.selected = this.selectAll;
    }
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
  blockSelected() {
    const selectedUserIds = this.users
      .filter(user => user.selected)
      .map(user => user._id);
      if (selectedUserIds.length === 0) {
        console.log('No users selected to block.');
        return;
      }
      console.log(selectedUserIds);
      this.dataService.blockUsers(selectedUserIds).subscribe(
        () => {
          console.log('Selected user(s) blocked successfully.');
          this.getUsers();
        },
        (error) => {
          console.log('Error blocking selected users:', error.error.message);
        }
      );
  }
  unblockSelected() {
    const selectedUserIds = this.users
      .filter(user => user.selected)
      .map(user => user._id);
      if (selectedUserIds.length === 0) {
        console.log('No users selected to unblock.');
        return;
      }
      console.log(selectedUserIds);
      this.dataService.unblockUsers(selectedUserIds).subscribe(
        () => {
          console.log('Selected user(s) unblocked successfully.');
          this.getUsers();
        },
        (error) => {
          console.log('Error unblocking selected user(s):', error.error.message);
        }
      );
  }

  deleteSelected() {
    // Similar logic to blockSelected()
  }
}
