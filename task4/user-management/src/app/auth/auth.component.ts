import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoading = false;
  isLoginMode = true;
  visible:boolean=false;
  changetype:boolean=false;
  errorMessage: string = '';

  constructor(private authService:AuthService, private router: Router){}

  onSubmit(form:NgForm){
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading=true;
    if (this.isLoginMode) {
      this.authService.login({ email, password })
        .subscribe({
          next:(resData)=>{
            console.log('Logged in!', resData.token);
            this.isLoading=false;
            this.router.navigate(['/user-management'])
          },
          error:(errorMessage)=>{
            this.errorMessage = errorMessage.toString().split(': ')[1];
            this.isLoading=false;
            console.error('Login failed:', errorMessage);
          }
        })
    }

    // Reset the form after submission if needed
    form.reset();
}
  viewpassword(){
    this.visible=!this.visible;
    this.changetype=!this.changetype;
  }
  onSwitchMode(){
    this.isLoginMode=!this.isLoginMode;
  }
}
