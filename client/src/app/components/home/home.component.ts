import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isFound: boolean = false;
  otherUsername: string = "";

  constructor(private userService: UserService) { }

  ngOnInit(): void {
      console.log("is found is " + this.isFound);

  }

}
