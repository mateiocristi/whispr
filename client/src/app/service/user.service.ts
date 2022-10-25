import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Globals } from '../utils/globals';
import { ChatService } from './chat.service';
import * as Buffer from 'buffer';
import { C2okieService } from './c2okie.service.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser?: User;
  private endUser?: User;

  constructor(
    private chatService: ChatService,
    private c2okieService: C2okieService,
    private http: HttpClient,
    private router: Router
  ) {}

  register(username: string, password: string): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    const raw = JSON.stringify({
      username: username,
      password: password,
    });

    const requestOptions = {
      method: 'POST',
      body: raw,
      headers: headers,
      redirect: 'follow',
    };

    return this.http.post<any>(
      Globals.API_ENDPOINT + '/user/create',
      raw,
      requestOptions
    );
  }

  executeLogin(username: string, password: string) {
    this.login(username, password).subscribe({
      next: (jwt) => {
        console.log('jwt ', jwt.access_token);

        this.decodeJWT(jwt.access_token);
        this.c2okieService.saveCookie("jwt", jwt);
        this.router.navigate(['/home']);
      },
      error: (e) => {
        // handle error
        console.log('error ', e);
      },
    });
  }

  login( username: string, password: string): Observable<Jwt> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const urlencoded = new URLSearchParams();
    urlencoded.append('username', username);
    urlencoded.append('password', password);

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: urlencoded,
      redirect: 'follow',
    };

    return this.http.post<Jwt>(Globals.API_ENDPOINT + '/login', urlencoded, {
      headers,
    });
  }

  decodeJWT(token: string) {
    this.currentUser = JSON.parse(
      atob(token.split('.')[1])
    ) as User;
    console.log("current user" + this.currentUser.username);
    // todo
    // this.currentUser.id = payload.id;
    // this.currentUser.username = payload.sub;
  }

  logout(): void {
    this.chatService.stompClient?.disconnect(() => {
      console.log('disconnected from chat');
    });
    // this.onUserChange.next(undefined);
    this.c2okieService.deleteAll();
    this.router.navigate(['/']);
  }

  checkUsername(username: string): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain');
    const reqOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this.http.get<string>(
      Globals.API_ENDPOINT + '/user/checkUsername/' + username,
      reqOptions
    );
  }

  setEndUser(user: User) {
    this.endUser = user;
  }

  getEndUser(): User {
    return this.endUser!;
  }

  setUser(user: User | undefined) {
    this.currentUser = user;
  }

  getUser(): User | undefined {
    return this.currentUser;
  }

}

export interface User {
  id: bigint;
  username: string;
}

export interface ChatRoom {
  id: string;
  users: Array<User>;
  messages: Array<Message>;
  lastMessage: Message;
}

export interface Message {
  id: bigint;
  userId: bigint;
  messageText: string;
  timestamp: number;
  isRead: boolean;
  type: string;
  chatRoomId: string;
}

export interface Jwt {
  access_token: string;
  refresh_token: string;
}
