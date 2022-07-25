import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatRoom, ChatService, EndUser } from 'src/app/service/chat.service';
import { User, UserService } from 'src/app/service/user.service';
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



  newMessage: Subscription = this.chatService.newMessage.subscribe((data) => {
    console.log("new message received");
    
    this.currentRoom!.messages = data;
  });

  endUserChange: Subscription = this.chatService.roomChange.subscribe((data) => {
    console.log("end user changed here");
    
    this.endUser = this.chatService.getEndUser();
    this.isEndUser = true ? this.chatService.otherUser !== undefined : false;
    console.log("end user " + this.chatService.otherUser?.username);
    console.log("end user type " + typeof this.chatService.otherUser);
    
    this.chatService.getChatRoom(data!).subscribe(data => {
      this.chatService.currentRoom = data;
      this.chatService.connectToChat();
    })
    // todo: update current room
  });

  constructor(private userService: UserService, private chatService: ChatService, private http: HttpClient) {
    this.endUser = chatService.getEndUser();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.endUserChange.unsubscribe();
  }

  sendButtonHandler(event: Event): void {
    console.log("message to be sent: " + this.messageText);
    
    if (this.messageText) {
      this.chatService.sendMessage(this.messageText);
    }
    
  }

}
