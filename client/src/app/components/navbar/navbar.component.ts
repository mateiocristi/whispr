import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User, UserService } from '../../service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User | undefined;
  isLoggedIn: boolean = false;
  
  userChange: Subscription = this.userService.onUserChange.subscribe(data => {
    this.user = this.userService.getUser();
    this.isLoggedIn = true ? this.userService.getUser() !== undefined : false;
    console.log("logged user change to " + this.user);
  });

  constructor(private userService: UserService) {
   }

  ngOnInit(): void {
    // this.isLoggedIn = true ? this.userService.getUser() !== undefined : false;
    
  }

  ngOnDestroy(): void {
      this.userChange.unsubscribe();
  }

  logout(): void {
    this.userService.logout();
  }

}
