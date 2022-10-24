import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { end } from '@popperjs/core';
import { ChatService } from 'src/app/service/chat.service';
import { ChatRoom, SimpleUser, User, UserService } from '../../../service/user.service';

@Component({
  selector: 'left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {

  @Output() conversationClick: EventEmitter<ChatRoom> = new EventEmitter<ChatRoom>()

  @Output() searchEntered: EventEmitter<string> = new EventEmitter<string>();
  searchedContact: string = "";

  @Input() currentUser!: User;
  @Input() chatRooms!: Array<ChatRoom>;
  @Input() currentChatRoom?: ChatRoom;

  constructor(private userService: UserService, private chatService: ChatService, private router: Router) {
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  onSearchTextEntered() {
    this.searchEntered.emit(this.searchedContact);
  }

  onConversationClick(conversation: ChatRoom) {
    this.conversationClick.emit(conversation);
  }

  logout(event: Event): void {
    this.userService.logout();
  }
}
