import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username: string | any = "";

  constructor(public userService: UserService) {
    this.username = userService.getLocalUser().username;
   }

  ngOnInit(): void {
    console.log("usernme is " + this.username);
  }

  logout(): void {
    this.userService.logout();
  }

}
