import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { ChatRoom, EndUser, User, UserService } from 'src/app/service/user.service';
import { Globals } from 'src/app/utils/globals';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit {

  endUser?: EndUser;
  isEndUser: boolean = false;
  currentRoom?: ChatRoom;
  messageText?: string; 

  // newMessage: Subscription = this.chatService.newMessage.subscribe((data) => {
  //   console.log("new message received");

  //   this.currentRoom!.messages = data;
  // });

  chatRoomChange: Subscription = this.userService.roomChange.subscribe((data) => {
    console.log("chat room changed");
    this.currentRoom = data;
    this.endUser = data?.users[0].username !== this.userService.getUser()!.username ? data!.users[0] : data!.users[1];
    this.userService.setEndUser(this.endUser);
    this.isEndUser = true ? this.endUser !== undefined : false;
  })

  constructor(private userService: UserService, private http: HttpClient) {
    this.currentRoom = userService.getChatRoom();
    // console.log("end user " + this.endUser?.username);
    // console.log("current room" + this.currentRoom?.id);    
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // this.chatService.roomChange.unsubscribe();
    // this.newMessage.unsubscribe();
  }

  sendButtonHandler(event: Event): void {
    console.log("message to be sent: " + this.messageText);
    
    if (this.messageText) {
      this.userService.sendMessage(this.messageText);
      this.messageText = "";
    }
  }
}
