import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { end } from '@popperjs/core';
import { pipe, Subscribable, Subscription } from 'rxjs';
import { ChatRoom, User, UserService } from '../../service/user.service';

@Component({
  selector: 'app-contacts-view',
  templateUrl: './contacts-view.component.html',
  styleUrls: ['./contacts-view.component.css']
})
export class ContactsViewComponent implements OnInit {

  currentUser?: User;
  searchedContact?: string;
  chatRooms?: Array<ChatRoom>;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.userService.onRoomChange.subscribe((data) => {
      this.chatRooms = new Array(...this.userService.getChatRooms());
    })
    this.chatRooms = new Array<ChatRoom>(...this.userService.getChatRooms());
    this.currentUser = this.userService.getUser();
  }

  ngOnDestroy(): void {
    this.userService.onRoomChange.unsubscribe();
  }

  handleSearch(event: Event): void {
    console.log("searching for user");
    if (this.searchedContact !== this.userService.getUser()!.username) {

      const nextChatRoom: ChatRoom | undefined = this.userService.findChatRoomWithUserField(this.searchedContact!);

      if (nextChatRoom!) {
        
        console.log("conversation exists...");
        this.userService.onRoomChange.next(nextChatRoom);

      } else {

        console.log("conversation not found... fetching...");
        this.userService.fetchChatRoomWithUsernames(this.searchedContact!).subscribe({
          next: (data) => {
            this.userService.addChatRoom(data);
            this.userService.onRoomChange.next(data);
            // this.userService.loadAllChat();
          },
          error: (e) => console.error(e)
        });
      }
    } else {

      console.log("current username was introduced");
    }
  }

  handleChatRoomClick(event: Event): void {
    const endUsername: string = (event.target as HTMLInputElement).innerText;
    this.userService.onRoomChange.next(this.userService.findChatRoomWithUserField(endUsername)!);
  }
}
