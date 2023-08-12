import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  constructor(private authService:AuthService, private router:Router){}

  logout(){
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
  
}
