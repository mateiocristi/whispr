import { Pipe, PipeTransform } from "@angular/core"
import { User } from "../service/user.service";


@Pipe({name: "GetEndUser"})
export class GetEndUserPipe implements PipeTransform {
    transform(value: Array<User>, currentUserId: bigint): User {
        return value.find(user => user.id !== currentUserId)!;
    }
}
