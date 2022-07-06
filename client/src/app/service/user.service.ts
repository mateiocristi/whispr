import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { ignoreElements } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class UserService {

    private user: User | undefined;

    constructor(private cookieService: CookieService, private http: HttpClient) {
        
    }

    checkUser() {

    }

    register(username: string, password: string) {
        const headers = { "Content-Type": "application/json"}
        const raw = JSON.stringify({
            "username": username,
            "password": password,
            "roles": ["USER"]
        });

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        };

        this.http.post<any>('http://localhost:4000/user/create', raw, requestOptions).subscribe(data => {
            console.log(data)
        });
    }

    login(username: string, password: string) {
        const headers = {"Content-Type": "application/x-www-form-urlencoded"};
        const urlencoded = new URLSearchParams();
        urlencoded.append("username", username);
        urlencoded.append("password", password);

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: urlencoded,
            redirect: 'follow'
        };

        const req = this.http.post<Jwt>('http://localhost:4000/login', requestOptions);

        this.getUser(username);

    }

    private getUser(username: string) {
        const headers = { "Content-Type": "application/json"};
        const requestOptions = {
            method: 'POST',
            headers: headers,
            redirect: 'follow'
        };

        const req = this.http.get<User>('http://localhost:4000/user/get/' + username);
        console.log("retrieved user: " + req);
        
    }

    private saveLocalUser(data: any) {
        this.cookieService.set('currentUser', data);
    }

    private getLocalUser() {
        return this.cookieService.get('currentUser');
    }


}

interface User {
    id: bigint,
    username: string,
    password: string,
    rooms: [],
    roles: [],
    messages: []
}

interface Jwt {
    access_token: string,
    refresh_token: string
}
