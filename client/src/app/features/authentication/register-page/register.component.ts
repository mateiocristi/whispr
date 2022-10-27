import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  isUsernameTaken: boolean = false;

  constructor(private router: Router, private http: HttpClient, private userService: UserService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm =  this.fb.group({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
      rPassword: new FormControl("", [Validators.required]),
    })
  }

  register() {
    console.log("checking username " + this.registerForm.get('username')?.value);
    this.userService.register(this.getUsername()!.value, this.getPassword()!.value).subscribe(data => {
      console.log(data);
  });
    this.router.navigateByUrl('/');
  }

  getUsername() {
    return this.registerForm.get('username');
  }

  getPassword() {
    return this.registerForm.get('password');
  }

  getrPassword() {
    return this.registerForm.get('rPassword');
  }

}
