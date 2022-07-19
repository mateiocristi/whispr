import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { pipe } from 'rxjs';
import { ChatService } from 'src/app/service/chat.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-contacts-view',
  templateUrl: './contacts-view.component.html',
  styleUrls: ['./contacts-view.component.css']
})
export class ContactsViewComponent implements OnInit {

  searchedContact: string | undefined;

  constructor(private userService: UserService, private chatService: ChatService, private router: Router) {}

  ngOnInit(): void {

  }

  handleSearch(event: Event): void {
    console.log("searching for user");
    if (this.searchedContact !== this.userService.getUser()!.username) {
        this.userService.checkUsername(this.searchedContact!).subscribe(text => {
        if (text === 'found') {
          // todo: set end user
          // this.chatService.setEndUser()
        }

      });
    } else {
      console.log("no good");
      console.log(this.userService.getUser()!.username);
    }
  }
}
