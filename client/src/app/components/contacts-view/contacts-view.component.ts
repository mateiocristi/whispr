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

  searchedContact?: string;

  constructor(private userService: UserService, private chatService: ChatService, private router: Router) {}

  ngOnInit(): void {

  }

  // data => {
  //   console.log("end data is " + data);
  //   this.chatService.setEndUser(data);  
  //   if (data === undefined)
  //     console.log('end user not found');
  //   else {
      
  //   }
  // }

  handleSearch(event: Event): void {
    console.log("searching for user");
    if (this.searchedContact !== this.userService.getUser()!.username) {
        this.chatService.fetchEndUser(this.searchedContact!).subscribe({
          next: (data) => this.chatService.setEndUser(data),
          error: (e) => console.error(e)
        });
    } else {
      console.log("current username was introduced");
    }
  }
}
