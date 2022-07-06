import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  username: string = "";
  password: string = "";
  rPassword: string = "";

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

  }

  register() {
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
