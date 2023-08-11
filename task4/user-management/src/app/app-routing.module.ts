import { NgModule } from '@angular/core';
import { AuthComponent } from 'src/auth/auth.component';
import { UserManagementComponent } from 'src/user-management/user-management.component';
import { RouterModule, Routes } from '@angular/router';

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
