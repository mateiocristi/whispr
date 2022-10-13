import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { ignoreElements, Observable, Subject } from "rxjs";
import { Globals } from "../utils/globals"
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";

@Injectable({
    providedIn: "root"
})
export class UserService {

    private user?: User;
    private chatRooms?: Array<ChatRoom> = new Array<ChatRoom>;
    private currentRoom?: ChatRoom;
    private endUser?: SimpleUser;

    private socket?: WebSocket;
    private stompClient?: Stomp.Client;

    onNewMessage = new Subject<Message>();
    onRoomChange = new Subject<ChatRoom>();
    onUserChange = new Subject<User | undefined>();

    constructor(private cookieService: CookieService, private http: HttpClient, private router: Router) {

        this.loginWithJWT().subscribe(data => {
            this.user = data;
            this.onUserChange.next(data);
        });

        this.onUserChange.subscribe((user: User | undefined) => {
            console.log("user has changed");

            this.user = user;
            if (user !== undefined) {
                this.saveCookie("currentUser", user);
                this.connectToChat();
                this.fetchAllChatRoomsAndMessages().subscribe(data => {
                    if (data.length > 0) {
                        this.chatRooms! = [...data];
                        this.onRoomChange.next(this.chatRooms!.at(0)!);
                    }
                })
                this.router.navigate(["/home"]);
            }
            else
                this.router.navigate(["/"]);
        });

        this.onRoomChange.subscribe((chatRoom: ChatRoom) => {
            console.log("loading new chat room");

            this.currentRoom = chatRoom;
            this.endUser = chatRoom!.users[0] !== this.user ? chatRoom!.users[0] : chatRoom!.users[1];
        });

        this.onNewMessage.subscribe((message: Message) => {
            let chatRoom: ChatRoom | undefined = this.findChatRoomWithUserField(message.userId);
            if (chatRoom!) {
                
                console.log("conversation exists... appending message");
                chatRoom.messages.push(message);
            } else {

                console.log("conversation is new... fetching");
                this.fetchChatRoomWithIds(message.id);
            }
        });
    }

    register(username: string, password: string): Observable<any> {
        console.log("registering with username " + username, + " paswword " + password);

        const headers = { "Content-Type": "application/json" }
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
        const access_token = this.getCookie(("jwt")).access_token;
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
        this.stompClient?.disconnect(() => {
            console.log("disconnected from chat");
        });
        this.onUserChange.next(undefined);
        this.deleteCookies();
        this.router.navigateByUrl("/");
    }

    checkUsername(username: string): Observable<string> {
        const headers = new HttpHeaders().set("Content-Type", "text/plain")
        const reqOptions: Object = {
            headers: headers,
            responseType: "text"
        }
        return this.http.get<string>(Globals.API_ENDPOINT + "/user/checkUsername/" + username, reqOptions);
    }

    connectToChat(): void {
        console.log("connecting to chat...");
        this.socket = new SockJS(Globals.API_ENDPOINT + "/chat");
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect({}, (frame) => {
            console.log(frame);
            this.stompClient!.subscribe(
                "/topic/messages/" + this.user!.id,
                (response) => {
                    // handle the message
                    let message: Message = JSON.parse(response.body)
                    console.log("new message ", message);
                    this.onNewMessage.next(message);
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
        }
    }

    fetchAllChatRoomsAndMessages(): Observable<Array<ChatRoom>> {
        const headers = { "Content-Type": "application/json" }
        return this.http.get<Array<ChatRoom>>(Globals.API_ENDPOINT + "/user/getAllChatRooms/" + this.user!.id);
    }

    fetchChatRoomWithUsernames(endUsername: String): Observable<ChatRoom> {
        const headers = { "Content-Type": "application/json" };
        return this.http.get<ChatRoom>(Globals.API_ENDPOINT + "/user/getChatRoomWithUsernames/" + this.user!.username + "/" + endUsername, { headers });
    }

    fetchChatRoomWithIds(endUserId: bigint): Observable<ChatRoom> {
        const headers = { "Content-Type": "application/json" };
        return this.http.get<ChatRoom>(Globals.API_ENDPOINT + "/user/getChatRoomWithIds/" + this.user!.id + "/" + endUserId, { headers });
    }

    addChatRoom(chatRoom: ChatRoom) {
        this.chatRooms!.push(chatRoom);
    }

    findChatRoomWithUserField(value: string | bigint): ChatRoom | undefined {
        type key = keyof SimpleUser;
        const myKey = typeof value === "string" ? "username" as key : "id" as key;
        
        let chatRoom: ChatRoom | undefined = undefined;
        this.chatRooms!.forEach(room => {
            if (room.users.map(user => user[myKey]).includes(value)) {
                chatRoom = room;
            }
        });
        return chatRoom;
    }

    getCurrentChatRoom(): ChatRoom {
        return this.currentRoom!;
    }

    getChatRooms(): Array<ChatRoom> {
        return this.chatRooms!;
    }

    setEndUser(user: SimpleUser) {
        this.endUser = user;
    }

    getEndUser(): SimpleUser {
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

export interface SimpleUser {
    id: bigint;
    username: string;
}

export interface ChatRoom {
    id: string;
    users: Array<SimpleUser>;
    messages: Array<Message>;
}

export interface Message {
    id: bigint;
    userId: bigint;
    messageText: string;
    timestamp: bigint;
    is_Read: boolean;
    type: string;
    chatRoomId: string;
}

interface Jwt {
    access_token: string;
    refresh_token: string;
}
