import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './features/authentication/register-page/register.component';
import { LoginComponent } from './features/authentication/login-page/login.component';
import { AuthPageComponent } from './features/authentication/auth-page/auth_page.component';
import { HomeComponent } from './features/chat/home-page/home.component';
import { RouteGuardService } from './service/routeGuard.service';

// todo: lazy load
const routes: Routes = [
  { path: '', component: AuthPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [RouteGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
