import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/service/chat.service';
import {
  ChatRoom,
  SimpleUser,
  User,
  UserService,
} from '../../../service/user.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  currentUser!: User;
  endUser?: SimpleUser;
  chatRooms: Array<ChatRoom> = new Array<ChatRoom>();
  currentChatRoom?: ChatRoom;

  messageSubscrition = new Subscription();

  constructor(
    private userService: UserService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUser()!;

    this.chatService
      .fetchAllChatRoomsAndMessages(this.currentUser!.id)
      .subscribe((chatRooms) => {
        chatRooms.forEach(
          (cr) =>
            (cr.lastMessage = this.chatService.findLastMessage(cr.messages))
        );
        this.chatRooms = chatRooms;

        this.messageSubscrition = this.chatService.messageEmitter.subscribe(
          (newMessage) => {
            console.log('message received ' + newMessage.messageText);
            const conversation = this.chatRooms.find(
              (cr) => cr.id === newMessage.chatRoomId
            );
            if (conversation?.id === this.currentChatRoom?.id) {
              // this.chatService.markOneMessagesAsRead(newMessage).subscribe();
            }
            //conversation exists; append message
            if (conversation) {
              conversation.messages.push(newMessage);
              conversation.lastMessage = newMessage;
            }
            //conversation is new; fetch chatRoom from server and append it to chatRooms
            if (!conversation) {
              this.chatService
                .fetchChatRoomWithIds(this.currentUser.id, newMessage.userId)
                .subscribe((chatRoom) => {
                  chatRoom.lastMessage = this.chatService.findLastMessage(
                    chatRoom.messages
                  );
                  this.chatRooms.push(chatRoom);
                });
            }
          }
        );
        this.chatService.connectToChat(this.currentUser!.id);

        try {
          this.currentChatRoom = chatRooms.at(0);
          this.endUser = this.currentChatRoom!.users.find(
            (user) => user.id != this.currentUser.id
          );
          // mark all messages as read
          // this.chatService.markMultipleMessagesAsRead(
          //   this.currentChatRoom!.id,
          //   this.endUser!.id,
          //   this.currentChatRoom!.messages
          // ).subscribe();
        } catch {
          console.log('no conversations');
        }
      });
  }

  handleConversationClick(chatRoom: ChatRoom) {
    this.currentChatRoom = chatRoom;
  }

  handleSearchContact(searchValue: string) {
    console.log('searching for user');
    if (searchValue === this.currentUser.username) {
      return;
    }

    const nextChatRoom: ChatRoom | undefined =
      this.chatService.findChatRoomWithUserField(this.chatRooms, searchValue!);

    if (nextChatRoom!) {
      console.log('conversation exists...');
      this.currentChatRoom = nextChatRoom;
      this.endUser = this.currentChatRoom.users.find(
        (user) => user.id !== this.currentUser.id
      );
      // mark all messages as read
      // this.chatService.markMultipleMessagesAsRead(
      //   this.currentChatRoom!.id,
      //   this.endUser!.id,
      //   this.currentChatRoom!.messages
      // ).subscribe();
    } else {
      console.log('conversation not found... fetching...');
      this.chatService
        .fetchChatRoomWithUsernames(this.currentUser!.username, searchValue!)
        .subscribe({
          next: (data) => {
            this.chatRooms.push(data);
          },
          error: (e) => console.error(e),
        });
    }
  }

  getAllChatRooms() {
    return this.chatRooms;
  }

  getCurrentChatRoom() {
    return this.currentChatRoom;
  }

  getLoggedUser() {
    return this.currentUser;
  }

  getEndUser() {
    return this.endUser;
  }
}
