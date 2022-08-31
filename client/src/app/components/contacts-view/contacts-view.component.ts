import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { pipe, Subscribable, Subscription } from 'rxjs';
import { ChatRoom, ChatService } from 'src/app/service/chat.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-contacts-view',
  templateUrl: './contacts-view.component.html',
  styleUrls: ['./contacts-view.component.css']
})
export class ContactsViewComponent implements OnInit {

  searchedContact?: string;
  chatRooms!: Array<ChatRoom>; 

  userChange: Subscription = this.userService.userChange.subscribe(() => {
    this.chatService.fetchAllChatRooms().subscribe(data => {
      this.chatRooms! = data;
    });
  });

  constructor(private userService: UserService, private chatService: ChatService, private router: Router) {
    this.chatRooms = new Array<ChatRoom>();
  }

  ngOnInit(): void {
  }

  handleSearch(event: Event): void {
    console.log("searching for user");
    if (this.searchedContact !== this.userService.getUser()!.username) {
        this.chatService.fetchChatRoom(this.searchedContact!).subscribe({
          next: (data) => {
            data.messages = new Array<any>();
            this.chatService.setChatRoom(data);
            this.chatService.loadAllChat();
          },
          error: (e) => console.error(e)
        });
    } else {
      console.log("current username was introduced");
    }
  }
}
