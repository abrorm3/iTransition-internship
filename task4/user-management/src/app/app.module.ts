import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthComponent } from './auth/auth.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './user-management/user-management.component';

@NgModule({
  declarations: [
    AppComponent,
    LoadingSpinnerComponent,
    AuthComponent,
    UserManagementComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    CommonModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
