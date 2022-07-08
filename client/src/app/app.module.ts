import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { LogonScreenComponent } from './components/logon_screen/logon_screen.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ContactsViewComponent } from './contacts-view/contacts-view.component';
import { ChatViewComponent } from './chat-view/chat-view.component';

@NgModule({
  declarations: [
    AppComponent,
    LogonScreenComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    ContactsViewComponent,
    ChatViewComponent
  ],
    imports: [
      HttpClientModule,
        BrowserModule,
        NgbModule,
        FormsModule,
        AppRoutingModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
