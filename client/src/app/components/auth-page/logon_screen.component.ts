import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-logon_screen',
  templateUrl: './logon_screen.component.html',
  styleUrls: ['./logon_screen.component.css']
})
export class LogonScreenComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    console.log("fuck you");
    
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
