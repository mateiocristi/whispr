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
    this.userService.loginWithUsernameAndPassword(this.username, this.password).subscribe(
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
    this.router.navigateByUrl('/');
  }

}
