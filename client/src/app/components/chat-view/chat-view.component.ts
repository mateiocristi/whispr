import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatRoom, ChatService, EndUser } from 'src/app/service/chat.service';
import { User, UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit {

  endUser?: EndUser;
  isEndUser: boolean = false;
  currentRoom?: ChatRoom;
  messageText!: string; 

  newMessage: Subscription = this.chatService.newMessage.subscribe((data) => {
    console.log("new message received");
    
    this.currentRoom!.messages = data;
  })

  endUserChange: Subscription = this.chatService.roomChange.subscribe((data) => {
    console.log("end user changed");
    
    this.endUser = this.chatService.getEndUser();
    this.isEndUser = true ? this.chatService.getEndUser() !== undefined : false;

    // todo: update current room
    this.chatService.connectToChat();
  })

  constructor(private userService: UserService, private chatService: ChatService) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.endUserChange.unsubscribe();
  }

  sendButtonHandler(event: Event): void {
    if (this.messageText) {
      this.chatService.sendMessage(this.messageText);
    }
    
  }

}
