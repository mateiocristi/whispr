import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  AfterViewChecked,
  ViewChild,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { ChatService } from 'src/app/service/chat.service';
import { ChatRoom, User, UserService } from 'src/app/service/user.service';
import { Globals } from 'src/app/utils/globals';

@Component({
  selector: 'chat-frame',
  templateUrl: './chat-frame.component.html',
  styleUrls: ['./chat-frame.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatFrameComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private messageContainer?: ElementRef;
  @Input() currentUser!: User;
  @Input() currentChatRoom!: ChatRoom;

  messageText?: string;

  samples: any;

  constructor(
    private userService: UserService,
    private chatService: ChatService
  ) {
    this.samples = [{id: 1}, {id: 2}, {id: 3}];
  }

  ngOnInit(): void {
    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {}

  sendButtonHandler(event: Event): void {
    console.log('message to be sent: ' + this.messageText);

    if (this.messageText) {
      console.log('sending message');
      const endUserId = this.currentChatRoom.users.find(
        (user) => user.id !== this.currentUser.id
      )!.id;
      this.chatService.sendMessage(
        this.userService.getUser()!.id,
        endUserId,
        this.messageText
      );
      this.messageText = '';
    }
  }

  scrollToBottom(): void {
    try {
      this.messageContainer!.nativeElement.scrollTop =
        this.messageContainer!.nativeElement.scrollHeight;
    } catch (err) {}
  }

  getSamples(): any {
    this.samples = this.getSamplesFromServer();
  }

  getSamplesFromServer(): any {
    return [{id: 1}, {id: 2}, {id: 3}, {id: 4}];
  }

  logDetection() {
    console.log("chat frame rendered");
  }

  logDetection1(obj: string) {
    console.log("chat x " + obj);
  }
}
