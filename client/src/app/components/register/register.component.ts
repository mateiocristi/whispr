import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  username: String = "";
  password: String = "";
  rPassword: String = "";

  constructor() { }

  ngOnInit(): void {

  }

  Register() {
    console.log(this.username);

    const headers = { "Content-Type": "application/json"}
    const raw = JSON.stringify({
      "username": this.username,
      "password": this.password,
      "roles": ["USER"]
    });

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: raw,
      redirect: 'follow'
    };

    this.http.post<any>('http://localhost:4000/user/register', raw, requestOptions).subscribe(data => {
      console.log(data)
    });
  }

}
