import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { pipe } from 'rxjs';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-contacts-view',
  templateUrl: './contacts-view.component.html',
  styleUrls: ['./contacts-view.component.css']
})
export class ContactsViewComponent implements OnInit {

  searchedContact: string | any = "";
  isChatOpen: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {

  }

  handleSearch(event: Event): void {
    console.log("searching for user");
    if (this.searchedContact !== this.userService.getLocalUser().username) {
        this.userService.checkUsername(this.searchedContact).subscribe(text => {
        if (text === 'found') {
          this.isChatOpen = true;
        }
          
      });
    } else {
      console.log("no good");
      console.log(this.userService.getLocalUser().username);
    }
  }
}
