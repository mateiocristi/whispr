import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { User } from "./user.service";

@Injectable({
    providedIn: 'root',
})
export class ChatService {

    otherUser: User | undefined;
    chatChange: Subject<User | undefined> = new Subject<User | undefined>()

    constructor() {
        this.chatChange.subscribe((value: User | undefined) => {
            this.otherUser = value;
        });
    }

    setEndUser(user: User | undefined) {
        this.chatChange.next(user);
    }

    getEndUser(): User | undefined {
        return this.otherUser;
    }
}

export interface EndUser {
    id: bigint;
    username: string;
}