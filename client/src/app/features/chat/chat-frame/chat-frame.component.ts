import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, AfterViewChecked, ViewChild, Input } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { ChatService } from 'src/app/service/chat.service';
import { ChatRoom, User, UserService } from 'src/app/service/user.service';
import { Globals } from 'src/app/utils/globals';

@Component({
  selector: 'chat-frame',
  templateUrl: './chat-frame.component.html',
  styleUrls: ['./chat-frame.component.scss'],
})
export class ChatFrameComponent implements OnInit, AfterViewChecked {
  @ViewChild("scrollContainer") private messageContainer: ElementRef | undefined;
  @Input() currentUser!: User;
  @Input() currentChatRoom!: ChatRoom;

  messageText?: string;

  constructor(private userService: UserService, private chatService: ChatService, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
  }

  sendButtonHandler(event: Event): void {
    console.log("message to be sent: " + this.messageText);

    if (this.messageText) {
      console.log("sending message");
      const endUserId = this.currentChatRoom.users.find(user => user.id !== this.currentUser.id)!.id;
      this.chatService.sendMessage(this.userService.getUser()!.id, endUserId, this.messageText);
      this.messageText = "";
    }
  }

  scrollToBottom(): void {
    try {
        this.messageContainer!.nativeElement.scrollTop = this.messageContainer!.nativeElement.scrollHeight;
    } catch(err) { }
}
}
