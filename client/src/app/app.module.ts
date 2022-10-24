import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AuthPageComponent } from './features/authentication/auth-page/auth_page.component';
import { RegisterComponent } from './features/authentication/register/register.component';
import { LoginComponent } from './features/authentication/login/login.component';
import { HomeComponent } from './features/home_page/home/home.component';
import { LeftPanelComponent } from './features/home_page/left-panel/left-panel.component';
import { ChatFrameComponent } from './features/home_page/chat-frame/chat-frame.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { RouteGuardService } from './service/routeGuard.service';
import { GetEndUserPipe } from './pipes/GetEndUser.pipe';

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
  providers: [RouteGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
