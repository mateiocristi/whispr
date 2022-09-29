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
    console.log("login user " + this.getUsername()?.value + " password " + this.getPassword()?.value);
    
    this.userService.loginWithUsernameAndPassword(this.getUsername()!.value, this.getPassword()!.value).subscribe(
      jwt => {
          console.log('jwt ' + jwt.access_token + 'refresh ' +jwt.refresh_token);
          
          this.userService.saveCookie('jwt', jwt);
          console.log('jwt ' + (this.userService.getCookie('jwt') || '{}').access_token);
          ;
          this.userService.loginWithJWT().subscribe(data => {
            console.log('username: ' + data.username + ' id: ' + data.id);
            this.userService.userChange.next(data);
            this.userService.getUser();
            this.userService.saveCookie('currentUser', data)
            this.router.navigateByUrl('/home');
        });
      }
     );
    this.router.navigate(['']);
  }

  getUsername(){
    return this.loginForm.get('username');
  }

  getPassword() {
    return this.loginForm.get('password');
  }

}
