import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { ChatService } from 'src/app/service/chat.service';
import { ChatRoom, Message, User, UserService } from '../../../service/user.service';

@Component({
  selector: 'left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeftPanelComponent implements OnInit {
  @Output() conversationClick: EventEmitter<ChatRoom> =
    new EventEmitter<ChatRoom>();

  @Output() searchEntered: EventEmitter<string> = new EventEmitter<string>();
  searchedContact: string = "";

  @Input() currentUser!: User;
  @Input() currentChatRoom?: ChatRoom;
  @Input() conversations?: Array<ChatRoom>;

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onSearchTextEntered() {
    this.searchEntered.emit(this.searchedContact);
  }

  onConversationClick(conversation: ChatRoom) {
    this.conversationClick.emit(conversation);
  }

  logout(event: Event): void {
    this.userService.logout();
  }

  printMessage(messsage: any) {
    console.log("last message ", JSON.stringify(messsage));

  }

  logDetection() {
    console.log("sidebar rendered");
  }
}
