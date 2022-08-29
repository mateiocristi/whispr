import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { ChatRoom, ChatService, EndUser, Message } from 'src/app/service/chat.service';
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
  messages!: Observable<Array<Message>>;

  // newMessage: Subscription = this.chatService.newMessage.subscribe((data) => {
  //   console.log("new message received");
  //   console.table(data);
  //   console.table(this.currentRoom?.messages);
  //   this.messages! = new Array<Message>(...data);
  // });

  endUserChange: Subscription = this.chatService.roomChange.subscribe((data) => {
    console.log("end user changed");
    
    this.endUser = this.chatService.getEndUser();
    this.isEndUser = true ? this.chatService.otherUser !== undefined : false;
    console.log("end user " + this.chatService.otherUser?.username);
    
    this.chatService.getChatRoom(data!).subscribe(data => {
      this.chatService.currentRoom = data;
      this.chatService.loadChat().subscribe((data) => {
        this.messages = of(data);
      })
      console.log("room id: " + this.chatService.currentRoom.id);
      console.log("messages: " + this.chatService.currentRoom.messages);
      console.log("users: " + this.chatService.currentRoom.users);
      
      
    })
    // todo: update current room
  });

  constructor(private userService: UserService, private chatService: ChatService, private http: HttpClient) {
    this.endUser = chatService.getEndUser();
  }

  ngOnInit(): void {
    this.chatService.connectToChat();
  }

  ngOnDestroy(): void {
    this.endUserChange.unsubscribe();
  }

  // loadChat(data: any) {
  //   const headers = { "Content-Type": "application/json"}
  //   this.messages = this.http.get<Array<Message>>(Globals.API_ENDPOINT + "/user/getMessages/" + data.id, { headers });
  //   this.messages.subscribe(data => {
  //     this.messages = of(data);
  //   })
  // }

  sendButtonHandler(event: Event): void {
    console.log("message to be sent: " + this.messageText);
    
    if (this.messageText) {
      this.chatService.sendMessage(this.messageText);
    }
    
  }

}
