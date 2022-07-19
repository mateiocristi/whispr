import {Component, NgModule, OnInit} from '@angular/core';
import {UserService} from './service/user.service';
import {ChatService} from './service/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService, ChatService]
})

export class AppComponent {
  
  constructor(private userService: UserService, private chatService: ChatService) {}

  ngOnInit(): void {
      
  }

}
