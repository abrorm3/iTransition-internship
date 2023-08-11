import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

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


  onSubmit(form:NgForm){

  }
  viewpassword(){
    this.visible=!this.visible;
    this.changetype=!this.changetype;
  }
  onSwitchMode(){
    this.isLoginMode=!this.isLoginMode;
  }
}
