import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
  }

  handleClick(event: Event) {
    let id: String = (event.target as Element).id;
    console.log("clicked id ", id);
    switch (id) {
      case "login-btn":
        this.router.navigateByUrl('/login');
        break;
      case "register-btn":  
        this.router.navigateByUrl('/register');
    }

  }
}
