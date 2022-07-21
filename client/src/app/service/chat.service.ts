import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { LoginComponent } from "../components/login/login.component";
import { User } from "./user.service";

@Injectable({
    providedIn: 'root',
})
export class ChatService {

    otherUser: EndUser | undefined;
    chatChange: Subject<EndUser | undefined> = new Subject<EndUser | undefined>();

    chatRooms: Map<string, object> = new Map<string, object>();


    constructor(private http: HttpClient) {
        this.chatChange.subscribe((value: EndUser | undefined) => {
            this.otherUser = value;
        });
    }

    fetchEndUser(username: string): Observable<EndUser | undefined> {
        console.log('checking user ' + username);
        
        const headers = new HttpHeaders().set("Content-Type", "text/plain")
        const reqOptions: Object = {
            headers: headers,
            responseType: 'text'
        }
        const req = this.http.get<EndUser | undefined>('http://localhost:4000/user/getEndUser/' + username, reqOptions);
        return req;
    }

    setEndUser(user: EndUser | undefined) {
        this.chatChange.next(user);
        console.log("end user x", this.otherUser);
        
    }

    getEndUser(): EndUser | undefined {
        return this.otherUser;
    }

    getEndUserFromServer() {

    }
}

export interface EndUser {
    id: bigint;
    username: string;
}

export interface ChatRoom {
    id: bigint;
    users: Set<EndUser>;
    messages: Set<object>;
}

export interface Message {
    id: bigint;
    messageText: string;
    timestamp: bigint;
    isRead: boolean;
    type: string;
    room: bigint;
    user: bigint;
}