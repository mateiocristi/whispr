import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { ignoreElements, Observable, Subject } from "rxjs";
import { Globals } from "../utils/globals"
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { ChatService } from "./chat.service";

@Injectable({
    providedIn: "root"
})
export class UserService {

    private user?: User;
    private endUser?: SimpleUser;

    constructor(private chatService: ChatService, private cookieService: CookieService, private http: HttpClient, private router: Router) {

    }

    register(username: string, password: string): Observable<any> {
        console.log("registering with username " + username, + " password " + password);

        const headers = { "Content-Type": "application/json" }
        const raw = JSON.stringify({
            "username": username,
            "password": password
        });

        const requestOptions = {
            method: "POST",
            body: raw,
            headers: headers,
            redirect: "follow"
        };

        return this.http.post<any>(Globals.API_ENDPOINT + "/user/create", raw, requestOptions);
    }

    login() {
        this.loginWithJWT().subscribe(data => {
            // this.onUserChange.next(data);
            if (data) {
                this.user = data;
                console.log("navig");

                this.router.navigate(["/home"]);
            }
        });
    }

    retrieveJWT(username: string, password: string): Observable<Jwt> {
        const headers = { "Content-Type": "application/x-www-form-urlencoded" };
        const urlencoded = new URLSearchParams();
        urlencoded.append("username", username);
        urlencoded.append("password", password);

        const requestOptions = {
            method: "POST",
            headers: headers,
            body: urlencoded,
            redirect: "follow"
        };

        return this.http.post<Jwt>(Globals.API_ENDPOINT + "/login", urlencoded, { headers });
    }

    loginWithJWT(): Observable<User> {
        const access_token = this.getCookie("jwt").access_token;
        console.log("access token from cookies: " + access_token);

        const headers = { "Content-Type": "application/json", "Authorization": "Bearer " + access_token };
        const requestOptions = {
            method: "POST",
            headers: headers,
            redirect: "follow"
        };
        return this.http.get<User>(Globals.API_ENDPOINT + "/user/login/", { headers });
    }


    logout(): void {
        this.chatService.stompClient?.disconnect(() => {
            console.log("disconnected from chat");
        });
        // this.onUserChange.next(undefined);
        this.deleteCookies();
        this.router.navigate(["/"]);
    }

    checkUsername(username: string): Observable<string> {
        const headers = new HttpHeaders().set("Content-Type", "text/plain")
        const reqOptions: Object = {
            headers: headers,
            responseType: "text"
        }
        return this.http.get<string>(Globals.API_ENDPOINT + "/user/checkUsername/" + username, reqOptions);
    }

    setEndUser(user: SimpleUser) {
        this.endUser = user;
    }

    getEndUser(): SimpleUser {
        return this.endUser!;
    }

    setUser(user: User | undefined) {
        this.user = user;
    }

    getUser(): User | undefined {
        return this.user;
}

    saveCookie(key: string, data: any) {
        this.cookieService.set(key, JSON.stringify(data));
    }

    getCookie(key: string): any {
        return JSON.parse(this.cookieService.get(key) || "{}");
    }

    deleteCookies(): void {
        this.cookieService.deleteAll();
    }
}

export interface User {
    id: bigint,
    username: string,
    password: string,
    roles: [],
}

export interface SimpleUser {
    id: bigint;
    username: string;
}

export interface ChatRoom {
    id: string;
    users: Array<SimpleUser>;
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

