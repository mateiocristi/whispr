import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, Subject } from "rxjs";
import { Globals } from "../utils/globals";
import * as Stomp from "stompjs";
import * as SockJs from "sockjs-client";
import { User, UserService } from "./user.service";
import { CookieService } from "ngx-cookie-service";
import { JsonPipe } from "@angular/common";


@Injectable({
    providedIn: "root",
})
export class ChatService {

    otherUser?: EndUser;
    currentRoom?: ChatRoom;
    socket?: WebSocket;
    stompClient?: Stomp.Client;  

    newMessage: Subject<Message> = new Subject<Message>();
    roomChange: Subject<EndUser | undefined> = new Subject<EndUser | undefined>();
    
    constructor(private http: HttpClient, private userService: UserService) {

        console.log("init chat service...");
   
        this.roomChange.subscribe((user: EndUser | undefined) => {
            this.otherUser = user;
            console.log("end user change to " + user);
            
        });
        this.newMessage.subscribe((message: Message) => {
            this.currentRoom!.messages.add(message)
        }) 
        
    }

    connectToChat(): void {
        const thisId = this.userService.getUser()?.id;
        const otherId = this.otherUser?.id;
        // load chat ...
        console.log("connecting to chat...");
        
        this.socket = new SockJs(Globals.API_ENDPOINT + "/chat");
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect({}, (frame) => {
            console.log(frame);
            this.stompClient!.subscribe(
                "/topic/messages/" + thisId, 
                (response) => {
                    // handle the message
                    // this.loadChat();
                    let message: Message = JSON.parse(response.body)
                    console.log("new message ", message);
                    alert("message: " + message.messageText);
                    // this.newMessage.next(message);
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
            // this.newMessage.next()
        }
    }

    getChatRoom(endUser: EndUser): Observable<ChatRoom> {
        const headers = { "Content-Type": "application/json"};
        return this.http.get<ChatRoom>(Globals.API_ENDPOINT +  "/user/getRoom/" + this.userService.getUser()!.id + "/" + endUser.id, { headers });
    }

    loadChat(): Observable<Array<Message>> {
        const headers = { "Content-Type": "application/json"}
        return this.http.get<Array<Message>>(Globals.API_ENDPOINT + "/user/getMessages/" + this.currentRoom!.id, { headers });
        // messages.subscribe(data => {
        //     console.log("pipi");
            
        //     console.table(data);
        //     messages = of(data);
        //     // this.newMessage.next(data);
        // })
        // // console.log("messages: " + this.currentRoom!.messages);
    }

    fetchEndUser(username: string): Observable<EndUser> {
        console.log('checking user ' + username);
        
        const headers = new HttpHeaders().set("Content-Type", "application/json");
        // const reqOptions: Object = {
        //     headers: headers,
        //     responseType: "json"
        // }
        const req = this.http.get<EndUser>(Globals.API_ENDPOINT + "/user/getEndUser/" + username, { headers });
        return req;
    }

    setEndUser(user: EndUser | undefined): void {
        this.roomChange!.next(user);
        console.log("end user ", this.otherUser);
        
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
    is_Read: boolean;
    type: string;
    room: ChatRoom;
    user: User;
}