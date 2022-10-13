import { Pipe, PipeTransform } from "@angular/core"
import { SimpleUser, User } from "../service/user.service";

@Pipe({name: "DisplayEndUsername"})
export class DisplayEndUsernamePipe implements PipeTransform {
    transform(value: Array<SimpleUser>, currentUserId: bigint): string {
        const user: SimpleUser = value.filter(user => user.id !== currentUserId).at(0)!;
        value.forEach(user => console.log("user pipe " + user.id))
        return user.username;
    }
}