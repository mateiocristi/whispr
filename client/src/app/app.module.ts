import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { LogonScreenComponent } from './components/auth-page/logon_screen.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ContactsViewComponent } from './components/contacts-view/contacts-view.component';
import { ChatViewComponent } from './components/chat-view/chat-view.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { RouteGuardService } from './service/routeGuard.service';
import { DisplayEndUsernamePipe } from './customPipes/DisplayEndUsername.pipe';




@NgModule({
  declarations: [
    AppComponent,
    LogonScreenComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    ContactsViewComponent,
    ChatViewComponent,
    UserProfileComponent,
    DisplayEndUsernamePipe
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
  providers: [RouteGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
