import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-logon_screen',
  templateUrl: './auth_page.component.html',
  styleUrls: ['./auth_page.component.css']
})
export class AuthPageComponent implements OnInit {

  constructor( private readonly router: Router) {}

  ngOnInit(): void {
  }

  goToLogin() {
    this.router.navigate(["/login"]);
  }

  goToRegister() {
    this.router.navigate(["/register"]);
  }

}
