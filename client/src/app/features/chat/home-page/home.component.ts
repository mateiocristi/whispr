import { ChangeDetectionStrategy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, takeUntil } from 'rxjs';
import { ChatService } from 'src/app/service/chat.service';
import { ChatRoom, User, UserService } from '../../../service/user.service';
import { Unsub } from '../../unsub.class';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends Unsub implements OnInit {
  currentUser!: User;
  endUser?: User;
  chatRooms?: Array<ChatRoom>;
  currentChatRoom?: ChatRoom;
  
  // conversations$?: Observable<Array<ChatRoom>>;

  chatRoomsSub?: Subscription;
  messageSub?: Subscription;

  constructor(
    private userService: UserService,
    private chatService: ChatService
  ) {
    super();
  }

  ngOnInit(): void {
    this.currentUser = this.userService.getUser()!;

    // this.conversations$ = this.chatService.fetchAllChatRoomsAndMessages(this.currentUser.id);
    this.chatRoomsSub = this.chatService
      .fetchAllChatRoomsAndMessages(this.currentUser.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.chatRooms! = new Array<ChatRoom>(...data);
        this.currentChatRoom = this.chatService.findChatRoomWithUserField(data, this.currentUser.id);
      });

    this.chatService.connectToChat(this.currentUser!.id);

    this.messageSub = this.chatService.messageEmitter.subscribe(
      (newMessage) => {
        console.log('message received ' + newMessage.messageText);
        const conversation = this.chatRooms?.find(
          (cr) => cr.id === newMessage.chatRoomId
        );

        //conversation exists; append message
        if (conversation) {
          conversation.messages.push(newMessage);
          conversation.lastMessage = newMessage;
        }
        //conversation is new; fetch chatRoom from server and append it to chatRooms
        if (!conversation) {
          this.chatService
            .fetchChatRoomWithIds(this.currentUser.id, newMessage.userId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((chatRoom) => {
              this.chatRooms?.push(chatRoom);
            });
        }

        this.chatRooms = new Array<ChatRoom>(...this.chatRooms!);
      }
    );
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
      this.chatService.findChatRoomWithUserField(this.chatRooms!, searchValue!);

    if (nextChatRoom!) {
      console.log('conversation exists...');
      this.currentChatRoom = nextChatRoom;
      this.endUser = this.currentChatRoom.users.find(
        (user) => user.id !== this.currentUser.id
      );

    } else {
      console.log('conversation not found... fetching...');
      // todo unsubscribe when anotehr search triggers
      this.chatService
        .fetchChatRoomWithUsernames(this.currentUser!.username, searchValue!)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (data) => {
            this.chatRooms?.push(data);
          },
          error: (e) => console.error(e),
        });
    }
  }

  logDetection() {
    console.log('home rendered');
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
