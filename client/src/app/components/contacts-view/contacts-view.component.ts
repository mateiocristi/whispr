import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { pipe, Subscribable, Subscription } from 'rxjs';
import { ChatRoom, UserService } from '../../service/user.service';

@Component({
  selector: 'app-contacts-view',
  templateUrl: './contacts-view.component.html',
  styleUrls: ['./contacts-view.component.css']
})
export class ContactsViewComponent implements OnInit {

  searchedContact?: string;
  chatRooms?: Set<ChatRoom>; 

  constructor(private userService: UserService, private router: Router) {
    this.chatRooms = new Set<ChatRoom>(userService.getAllChatRooms());
  }

  ngOnInit(): void {
  }

  ngOnDestroy() :void {

  }

  handleSearch(event: Event): void {
    console.log("searching for user");
    if (this.searchedContact !== this.userService.getUser()!.username) {
        this.userService.fetchChatRoom(this.searchedContact!).subscribe({
          next: (data) => {
            data.messages = new Array<any>();
            this.userService.setChatRoom(data);
            this.userService.loadAllChat();
          },
          error: (e) => console.error(e)
        });
    } else {
      console.log("current username was introduced");
    }
  }
}
