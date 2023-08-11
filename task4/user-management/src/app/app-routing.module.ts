import { NgModule } from '@angular/core';
import { AuthComponent } from 'src/app/auth/auth.component';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './user-management/user-management.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: '', redirectTo: '/user-management', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
