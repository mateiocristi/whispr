import { LoginComponent } from "../features/authentication/login-page/login.component";

export abstract class User {
  username?: string;
  id?: bigint;

  constructor(username: string, id: bigint) {
    this.username = username;
    this.id = id;
  }
}
