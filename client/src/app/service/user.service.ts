import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { ignoreElements, Observable, Subject } from "rxjs";
import { Globals } from "../utils/globals"
import * as Stomp from "stompjs";
import * as SockJs from "sockjs-client";

@Injectable({
    providedIn: "root"
})
export class UserService {

    private user?: User;
    private chatRooms?: Set<ChatRoom>;
    private currentRoom?: ChatRoom;
    private endUser?: EndUser;

    private socket?: WebSocket;
    private stompClient?: Stomp.Client;  

    newMessage: Subject<Array<Message>> = new Subject<Array<Message>>();
    roomChange: Subject<ChatRoom | undefined> = new Subject<ChatRoom | undefined>();
    userChange: Subject<User | undefined> = new Subject<User | undefined>();

    constructor(private cookieService: CookieService, private http: HttpClient, private router: Router) {

        this.chatRooms = new Set<ChatRoom>();
        
        this.loginWithJWT().subscribe(data => {
            this.user = data;
            this.userChange.next(data);
            this.saveCookie("currentUser", data);
        });

        this.userChange.subscribe((user: User | undefined) => {
            console.log("user has changed");
            
            this.user = user;
            if (user !== undefined) {
                this.connectToChat();
                this.fetchAllChatRooms().subscribe(data => {
                    this.chatRooms! = new Set<ChatRoom>(data);
                })
                this.router.navigateByUrl("/home");
            }
            else
                this.router.navigateByUrl("/");    
        });

        this.roomChange.subscribe((chatRoom: ChatRoom | undefined) => {
            console.log("setting chat room");
            
            chatRoom!.messages = new Array<Message>(); 
            this.currentRoom = chatRoom;
            this.chatRooms!.add(chatRoom!);
            this.endUser = chatRoom!.users[0] !== this.user ? chatRoom!.users[0] : chatRoom!.users[1]; 
        });

        this.newMessage.subscribe((messages: Array<Message>) => {
            this.currentRoom!.messages = messages;
        }); 
    }

    register(username: string, password: string): Observable<any> {

        console.log("registering with username " + username, + " paswword " +  password);
        

        const headers = { "Content-Type": "application/json"}
        const raw = JSON.stringify({
            "username": username,
            "password": password,
            "roles": ["USER"]
        });

        const requestOptions = {
            method: "POST",
            body: raw,
            headers: headers,
            redirect: "follow"
        };

        return this.http.post<any>(Globals.API_ENDPOINT + "/user/create", raw, requestOptions);
    }

    loginWithUsernameAndPassword(username: string, password: string): Observable<Jwt> {
        const headers = {"Content-Type": "application/x-www-form-urlencoded"};
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
        const access_token = this.getCookie(("jwt")).access_token;
        console.log("access token from cookies: " + access_token);
        
        const headers = { "Content-Type": "application/json", "Authorization": "Bearer " + access_token};
        const requestOptions = {
            method: "POST",
            headers: headers,
            redirect: "follow"
        };
        return this.http.get<User>(Globals.API_ENDPOINT + "/user/login/", { headers });
    }

    logout(): void {
        this.userChange.next(undefined);
        this.deleteCookies();
        this.router.navigateByUrl("/");
    }

    checkUsername(username: string): Observable<string> {
        const headers = new HttpHeaders().set("Content-Type", "text/plain")
        const reqOptions: Object = {
            headers: headers,
            responseType: "text"
        }
        const req = this.http.get<string>(Globals.API_ENDPOINT + "/user/checkUsername/" + username, reqOptions);
        return req;
    }

    connectToChat(): void {
        console.log("connecting to chat...");
        this.socket = new SockJs(Globals.API_ENDPOINT + "/chat");
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect({}, (frame) => {
            console.log(frame);
            this.stompClient!.subscribe(
                "/topic/messages/" + this.user!.id, 
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
            
            this.stompClient!.send("/app/chat/" + this.user!.id + "/" + this.endUser!.id, {}, message);
            this.loadAllChat();
        }
    }

    fetchAllChatRooms(): Observable<Array<ChatRoom>> {
        const headers = {"Content-Type": "application/json" }
        return this.http.get<Array<ChatRoom>>(Globals.API_ENDPOINT + "/user/getAllChatRooms/" + this.user!.id);
    }

    fetchChatRoom(endUsername: String): Observable<ChatRoom> {
        const headers = {"Content-Type": "application/json"};
        return this.http.get<ChatRoom>(Globals.API_ENDPOINT +  "/user/getChatRoom/" + this.user!.username + "/" + endUsername, { headers });
    }

    setChatRoom(chatRoom: ChatRoom) {
        this.roomChange!.next(chatRoom);
    }

    getChatRoom(): ChatRoom {
        return this.currentRoom!;
    }

    getAllChatRooms(): Set<ChatRoom> {
        return this.chatRooms!;
    }

    loadAllChat(): void {
        const headers = {"Content-Type": "application/json"}
        const req = this.http.get<Array<Message>>(Globals.API_ENDPOINT + "/user/getMessages/" + this.currentRoom!.id, { headers });
        req.subscribe(data => {
            this.newMessage.next(data);
        });
    }


    setEndUser(user: EndUser) {
        this.endUser = user;
    }

    getEndUser(): EndUser{
        return this.endUser!;
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

    getUser(): User | undefined {
        return this.user;
    }
}

export interface User {
    id: bigint,
    username: string,
    password: string,
    roles: [],
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

interface Jwt {
    access_token: string,
    refresh_token: string
}
