import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService, EndUser } from 'src/app/service/chat.service';
import { User, UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit {

  endUser: EndUser | undefined;
  isEndUser: boolean = false;

  endUserChange: Subscription = this.chatService.chatChange.subscribe((data) => {
    console.log("end user changed");
    
    this.endUser = this.chatService.getEndUser();
    this.isEndUser = true ? this.chatService.getEndUser() !== undefined : false;
  })

  constructor(private userService: UserService, private chatService: ChatService) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.endUserChange.unsubscribe();
  }

}
