import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  isUsernameTaken: boolean = false;
  username: string = "";
  password: string = "";
  rPassword: string = "";

  constructor(private router: Router, private http: HttpClient, private userService: UserService) { }

  ngOnInit(): void {

  }

  register() {
    console.log(this.username);

    this.userService.checkUsername(this.username).subscribe()
    this.userService.register(this.username, this.password);
    this.router.navigateByUrl('/');
  }

}
