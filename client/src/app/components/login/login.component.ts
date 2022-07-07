import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = "";
  password: string = "";

  constructor(private router: Router, private http: HttpClient, private userService: UserService) { }

  ngOnInit(): void {
  }

  login() {
    this.userService.loginWithUsernameAndPassword(this.username, this.password);
    this.router.navigateByUrl('/');
  }

}
