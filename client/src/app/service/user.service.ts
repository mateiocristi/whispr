import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { ChatService } from './chat.service';
import * as Buffer from 'buffer';
import { C2okieService } from './c2okie.service.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public currentUser?: User;
  public endUser?: User;

  constructor(
    private chatService: ChatService,
    private c2okieService: C2okieService,
    private http: HttpClient,
    private router: Router
  ) {}

  register(name: string, passwd: string): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    const raw = JSON.stringify({
      username: name,
      password: passwd
    });

    const requestOptions = {
      method: 'POST',
      headers: headers,
      redirect: 'follow',
    };

    return this.http.post<any>(
      environment.API_ENDPOINT + '/api/auth/signUp', raw, requestOptions
    );
  }

  executeLogin(username: string, password: string) {
    this.singIn(username, password).subscribe({
      next: (res) => {
        console.log('jwt ', res.token);

        this.currentUser = res as User;
        this.c2okieService.set('jwt', res.token as string);
        this.router.navigate(['/home']);
      },
      error: (e) => {
        // handle error
        console.log('error ', e);
      },
    });
  }

  singIn( username: string, password: string): Observable<SignInResponse> {
    const headers = { 'Content-Type': 'application/json' };
    const user = JSON.stringify({
      username: username,
      password: password
    })

    const requestOptions = {
      method: 'POST',
      headers: headers,

      redirect: 'follow',
    };

    return this.http.post<SignInResponse>(environment.API_ENDPOINT + '/api/auth/signIn', user, requestOptions);
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
      environment.API_ENDPOINT + '/api/res/checkUsername/' + username,
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

export interface SignInResponse {
  id: bigint,
  username: string,
  roles: string[],
  token: string,
  type: string
}
