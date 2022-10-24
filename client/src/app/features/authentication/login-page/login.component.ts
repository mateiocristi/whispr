import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  loginForm!: FormGroup;

  constructor(private router: Router, private http: HttpClient, private userService: UserService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    });
  }

  login() {
    this.userService.executeLogin(this.getUsername()!.value, this.getPassword()!.value);
  }

  getUsername(){
    return this.loginForm.get('username');
  }

  getPassword() {
    return this.loginForm.get('password');
  }

}
