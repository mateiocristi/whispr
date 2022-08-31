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

    private chatRooms?: Array<ChatRoom>;
    private endUser?: EndUser;
    private currentRoom?: ChatRoom;
    private socket?: WebSocket;
    private stompClient?: Stomp.Client;  

    newMessage: Subject<Array<Message>> = new Subject<Array<Message>>();
    roomChange: Subject<ChatRoom | undefined> = new Subject<ChatRoom | undefined>();
    
    constructor(private http: HttpClient, private userService: UserService) {
        
        console.log("init chat service...");

        this.chatRooms = new Array<ChatRoom>();

        this.userService.userChange.subscribe(() => {
            this.connectToChat();
            this.fetchAllChatRooms().subscribe(data => {
                this.chatRooms! = data;
            })
        })

        this.roomChange.subscribe((chatRoom: ChatRoom | undefined) => {
            console.log("setting chat room");
            
            chatRoom!.messages = new Array<Message>(); // era cu any
            this.currentRoom = chatRoom;
            this.chatRooms!.push(chatRoom!);
            this.endUser = chatRoom!.users[0] !== userService.getUser() ? chatRoom!.users[0] : chatRoom!.users[1]; 
        });
        this.newMessage.subscribe((messages: Array<Message>) => {
            this.currentRoom!.messages = messages;
        }); 
        
    }

    connectToChat(): void {
        const thisId = this.userService.getUser()?.id;
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
                    let message: Message = JSON.parse(response.body)
                    console.log("new message ", message);
                    this.loadAllChat();
                }
            )
        }, err => {
            console.log("error " + err);
            
        });
    }

    sendMessage(message?: string) {
        console.log("message to be sent is " + message);
    
        if (message !== undefined) {
            console.log("message is sending...");
            
            this.stompClient!.send("/app/chat/" + this.userService.getUser()!.id + "/" + this.getEndUser()!.id, {}, message);
            this.loadAllChat();
        }
    }

    fetchAllChatRooms(): Observable<Array<ChatRoom>> {
        const headers = {"Content-Type": "application/json" }
        return this.http.get<Array<ChatRoom>>(Globals.API_ENDPOINT + "/user/getAllChatRooms/" + this.userService.getUser()!.id);
    }

    fetchChatRoom(endUsername: String): Observable<ChatRoom> {
        const headers = {"Content-Type": "application/json"};
        return this.http.get<ChatRoom>(Globals.API_ENDPOINT +  "/user/getChatRoom/" + this.userService.getUser()!.username + "/" + endUsername, { headers });
    }

    setChatRoom(chatRoom: ChatRoom) {
        this.roomChange!.next(chatRoom);
    }

    getChatRoom(): ChatRoom {
        return this.currentRoom!;
    }

    getAllChatRooms(): Array<ChatRoom> {
        return this.chatRooms!;
    }

    loadAllChat(): void {
        const headers = {"Content-Type": "application/json"}
        const req = this.http.get<Array<Message>>(Globals.API_ENDPOINT + "/user/getMessages/" + this.currentRoom!.id, { headers });
        req.subscribe(data => {
            this.newMessage.next(data);
        });
    }

    // fetchEndUser(username: string): Observable<EndUser> {
    //     console.log('checking user ' + username);
    //     const headers = new HttpHeaders().set("Content-Type", "application/json");
    //     const req = this.http.get<EndUser>(Globals.API_ENDPOINT + "/user/getEndUser/" + username, { headers });
    //     return req;
    // }

    setEndUser(user: EndUser) {
        this.endUser = user;
    }

    getEndUser(): EndUser{
        return this.endUser!;
    }
}

export interface EndUser {
    id: bigint;
    username: string;
}

export interface ChatRoom {
    id: bigint;
    users: Array<EndUser>;
    messages: Array<any>;
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