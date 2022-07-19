import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/service/chat.service';
import { User, UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.css']
})
export class ChatViewComponent implements OnInit {

  endUser: User | undefined;
  isEndUser: boolean = false;

  endUserChange: Subscription = this.chatService.chatChange.subscribe((data) => {
    this.endUser = this.chatService.getEndUser();
    this.isEndUser = true ? this.chatService.getEndUser() !== undefined : false;
  })

  constructor(private userService: UserService, private chatService: ChatService) {}

  ngOnInit(): void {
    this.endUserChange.unsubscribe();
  }

}
