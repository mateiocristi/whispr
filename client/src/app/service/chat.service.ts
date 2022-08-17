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
        // this.otherUser = chatService.getEndUser();
        console.log("room");
        
        
        this.roomChange.subscribe((user: EndUser | undefined) => {
            this.otherUser = user;
            console.log("end user change to " + user);
             
            // todo: get chat room from server using current and end user ids.. done ..testing
            
        });
        this.newMessage.subscribe((messages: Set<Message>) => {
            this.currentRoom!.messages = messages;
        }) 
        
    }

    connectToChat(): void {
        const thisId = this.userService.getUser()!.id;
        const otherId = this.otherUser?.id;
        // load chat ...
        console.log("connecting to chat...");
        
        this.socket = new SockJs(Globals.API_ENDPOINT + "/chat");
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect({}, (frame) => {
            console.log("connected to xyz " + frame);
            return this.stompClient!.subscribe(
                "topic/messages/" + this.currentRoom!.id, 
                (response) => {
                    // handle the message
                    this.loadChat();
                }
            )
        }, err => {
            console.log("error " + err);
            
        });
    }

    sendMessage(message?: string): void {
        console.log("message to be sent is " + message);
    
        if (message !== undefined) {
            console.log("message is sending...");
            
            this.stompClient!.send("/app/chat/" + this.userService.getUser()!.id + "/" + this.getEndUser()!.id, {}, message);
        }
    }

    getChatRoom(endUser: EndUser): Observable<ChatRoom> {
        console.log("imediat");

        const headers = { "Content-Type": "application/json"};
        return this.http.get<ChatRoom>(Globals.API_ENDPOINT +  "/user/getRoom/" + this.userService.getUser()!.id + "/" + endUser.id, { headers });
    }

    loadChat(): void {
        const headers = { "Content-Type": "application/json"}
        let req = this.http.get<Set<Message>>(Globals.API_ENDPOINT + "/user/getMessages" + this.currentRoom!.id, { headers });
        req.subscribe(data => {
            this.newMessage.next(data);
        })
        console.log("messages: " + this.currentRoom!.messages);
    }

    fetchEndUser(username: string): Observable<EndUser> {
        console.log('checking user ' + username);
        
        const headers = new HttpHeaders().set("Content-Type", "application/json");
        const reqOptions: Object = {
            headers: headers,
            responseType: "json"
        }
        const req = this.http.get<EndUser>(Globals.API_ENDPOINT + "/user/getEndUser/" + username, reqOptions);
        return req;
    }

    setEndUser(user: EndUser | undefined): void {
        this.roomChange!.next(user);
        console.log("end user x", this.otherUser);
        
    }

    getEndUser(): EndUser{
        return this.otherUser!;
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
    messages: Set<Message>;
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