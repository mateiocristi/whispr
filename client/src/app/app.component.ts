import {Component, NgModule, OnInit} from '@angular/core';
import {UserService} from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})

export class AppComponent {
  
  constructor(private userService: UserService) {}

  ngOnInit(): void {
      
  }

}
