import { Pipe, PipeTransform } from "@angular/core"
import { SimpleUser } from "../service/user.service";


@Pipe({name: "GetEndUser"})
export class GetEndUserPipe implements PipeTransform {
    transform(value: Array<SimpleUser>, currentUserId: bigint): SimpleUser {
        return value.find(user => user.id !== currentUserId)!;
    }
}