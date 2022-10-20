import { Injectable } from '@angular/core';
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { Observable, Subject } from 'rxjs';
import { ChatRoom, Message, SimpleUser } from './user.service';
import { Globals } from '../utils/globals';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket?: WebSocket;
  stompClient?: Stomp.Client;

  messageEmitter: Subject<Message> = new Subject<Message>;

  constructor(private http: HttpClient) { }

  connectToChat(user_id: bigint): void {
    console.log("connecting to chat...");
    this.socket = new SockJS(Globals.API_ENDPOINT + "/chat");
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.connect({}, (frame) => {
      console.log(frame);
      this.stompClient!.subscribe(
        "/topic/messages/" + user_id,
        (response) => {
          // handle the message
          const message: Message = JSON.parse(response.body)
          console.log("new message ", message);
          this.messageEmitter.next(message);
        }
      )
    }, err => {
      console.log("error " + err);
    });
  }

  sendMessage(currentUserId: bigint, endUserId: bigint, message: string) {
    console.log("message to be sent is " + message);

    if (message !== undefined) {
      console.log("message is sending...");

      this.stompClient!.send("/app/chat/" + currentUserId + "/" + endUserId, {}, message);
    }
  }

  fetchAllChatRoomsAndMessages(currentUserId: bigint): Observable<Array<ChatRoom>> {
    const headers = { "Content-Type": "application/json" }
    return this.http.get<Array<ChatRoom>>(Globals.API_ENDPOINT + "/user/getAllChatRooms/" + currentUserId);
  }

  fetchChatRoomWithUsernames(currentUsername: String, endUsername: String): Observable<ChatRoom> {
    const headers = { "Content-Type": "application/json" };
    return this.http.get<ChatRoom>(Globals.API_ENDPOINT + "/user/getChatRoomWithUsernames/" + currentUsername + "/" + endUsername, { headers });
  }

  fetchChatRoomWithIds(currentUserId: bigint, endUserId: bigint): Observable<ChatRoom> {
    const headers = { "Content-Type": "application/json" };
    return this.http.get<ChatRoom>(Globals.API_ENDPOINT + "/user/getChatRoomWithIds/" + currentUserId + "/" + endUserId, { headers });
  }

  findChatRoomWithUserField(chatRooms: Array<ChatRoom>, value: string | bigint): ChatRoom | undefined {
    type key = keyof SimpleUser;
    const fieldKey = typeof value === "string" ? "username" as key : "id" as key;

    return chatRooms!.find(x => x.users.some(u => u[fieldKey] === value));
  }

  findLastMessage(messages: Array<Message>): Message {
    console.log("find last message");
    
    const maxTimestamp = Math.max(...messages.map(x => x.timestamp));
    return messages.find(message => message.timestamp === maxTimestamp)!;
  }
}
