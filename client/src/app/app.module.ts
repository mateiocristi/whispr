import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AuthPageComponent } from './features/authentication/auth-page/auth_page.component';
import { RegisterComponent } from './features/authentication/register-page/register.component';
import { LoginComponent } from './features/authentication/login-page/login.component';
import { HomeComponent } from './features/chat/home-page/home.component';
import { LeftPanelComponent } from './features/chat/left-panel/left-panel.component';
import { ChatFrameComponent } from './features/chat/chat-frame/chat-frame.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { RouteGuardService } from './service/routeGuard.service';
import { GetEndUserPipe } from './pipes/GetEndUser.pipe';
import { TokenInterceptorService } from './service/token-interceptor.service';
import { UserService } from './service/user.service';
import { C2okieService } from './service/c2okie.service.service';

@NgModule({
  declarations: [
    AppComponent,
    AuthPageComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    LeftPanelComponent,
    ChatFrameComponent,
    GetEndUserPipe
  ],
    imports: [
      HttpClientModule,
      BrowserModule,
      NgbModule,
      ReactiveFormsModule,
      FormsModule,
      AppRoutingModule,
      BrowserAnimationsModule,
    ],
  providers: [
    RouteGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true, deps: [UserService, C2okieService] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
