import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Globals } from '../utils/globals';
import { ChatService } from './chat.service';
import * as Buffer from 'buffer';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser?: User;
  private endUser?: User;

  constructor(
    private chatService: ChatService,
    private cookieService: CookieService,
    private http: HttpClient,
    private router: Router
  ) {}

  register(username: string, password: string): Observable<any> {
    console.log(
      'registering with username ' + username,
      +' password ' + password
    );

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
        this.router.navigate(['/home']);
      },
      error: (e) => {
        // handle error
        console.log('error ', e);
      },
    });
  }

  login( username: string = this.currentUser!.username, password: string): Observable<Jwt> {
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
    const payload: Payload = JSON.parse(
      Buffer.Buffer.from(token.split('.')[1], 'base64').toString()
    );
    // todo
    // this.currentUser.id = payload.id;
    // this.currentUser.username = payload.sub;
  }

  logout(): void {
    this.chatService.stompClient?.disconnect(() => {
      console.log('disconnected from chat');
    });
    // this.onUserChange.next(undefined);
    this.deleteCookies();
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

  saveCookie(key: string, data: any) {
    this.cookieService.set(key, JSON.stringify(data));
  }

  getCookie(key: string): any {
    return JSON.parse(this.cookieService.get(key) || '{}');
  }

  deleteCookies(): void {
    this.cookieService.deleteAll();
  }
}

export interface Payload {
  sub: string;
  id: bigint;
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

interface Jwt {
  access_token: string;
  refresh_token: string;
}
