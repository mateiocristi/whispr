import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { ChatRoom, SimpleUser, User, UserService } from 'src/app/service/user.service';
import { Globals } from 'src/app/utils/globals';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit {

  endUser?: SimpleUser;
  currentRoom?: ChatRoom;
  messageText?: string; 

  constructor(private userService: UserService, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.userService.onRoomChange.subscribe((data) => {
      console.log("chat room changed");
      this.currentRoom = data;
      this.endUser = data?.users[0].username !== this.userService.getUser()!.username ? data!.users[0] : data!.users[1];
      this.userService.setEndUser(this.endUser);
    });
    this.currentRoom = this.userService.getCurrentChatRoom();
  }

  ngOnDestroy(): void {
    this.userService.onRoomChange.unsubscribe();
  }

  sendButtonHandler(event: Event): void {
    console.log("message to be sent: " + this.messageText);
    
    if (this.messageText) {
      this.userService.sendMessage(this.messageText);
      this.messageText = "";
    }
  }
}
