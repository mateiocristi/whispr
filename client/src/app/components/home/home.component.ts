import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  // otherUsername: string = "";
  // currentUserChange: Subscription = this.userService.userChange.subscribe(data => {
  //   this.chatSerive.connectToChat();
  // }
  // );

  constructor(private userService: UserService) { }

  ngOnInit(): void {
      
  }

}
