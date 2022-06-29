import {Component, NgModule, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  username: String = "";
  password: String = "";
  rPassword: String = "";

  constructor(private http: HttpClient) { }

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

    this.http.post<any>('https://reqres.in/api/posts', raw, requestOptions).subscribe(data => {
      console.log(data)
    });
  }

}
