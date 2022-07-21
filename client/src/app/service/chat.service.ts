import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Globals } from "../utils/globals";
import * as Stomp from "stompjs";
import * as SockJs from "sockjs-client";
import { User, UserService } from "./user.service";


@Injectable({
    providedIn: "root",
})
export class ChatService {

    otherUser?: EndUser;
    currentRoom?: ChatRoom;
    socket?: WebSocket;
    stompClient?: Stomp.Client;  

    newMessage: Subject<Set<Message>> = new Subject<Set<Message>>();
    roomChange: Subject<EndUser | undefined> = new Subject<EndUser | undefined>();

    constructor(private http: HttpClient, private userService: UserService) {
        this.roomChange.subscribe((user: EndUser | undefined) => {
            this.otherUser = user;
            // todo: get chat room from server using current and end user ids
        });
        this.newMessage.subscribe((messages: Set<Message>) => {
            this.currentRoom!.messages = messages;
        }) 
    }

    connectToChat(): void {
        const thisId = this.userService.getUser()!.id;
        const otherId = this.otherUser?.id;
        // load chat ...
        this.socket = new SockJs(Globals.API_ENDPOINT + "/chat");
        this.stompClient?.connect({}, (frame) => {
            console.log("connected to " + frame);
            return this.stompClient?.subscribe(
                "topic/messages" + this.currentRoom!.id, 
                (response) => {
                    // handle the message
                    this.loadChat();
                }
            )
        })
    }

    sendMessage(message?: string): void {
        console.log("message to be sent is " + message);
    
        if (message !== undefined) {
            this.stompClient?.send("/app/chat" + this.userService.getUser()!.id + "/" + this.getEndUser()!.id);
        }
    }

    loadChat(): void {
        let req = this.http.get<Set<Message>>(Globals.API_ENDPOINT + "/getMessages" + this.currentRoom!.id);
        req.subscribe(data => {
            this.newMessage.next(data);
        })
        console.log("messages: " + this.currentRoom!.messages);
    }

    fetchEndUser(username: string): Observable<EndUser | undefined> {
        console.log('checking user ' + username);
        
        const headers = new HttpHeaders().set("Content-Type", "text/plain")
        const reqOptions: Object = {
            headers: headers,
            responseType: "text"
        }
        const req = this.http.get<EndUser | undefined>(Globals.API_ENDPOINT + "/user/getEndUser/" + username, reqOptions);
        return req;
    }

    setEndUser(user: EndUser | undefined) {
        this.roomChange?.next(user);
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
    room: ChatRoom;
    user: User;
}