import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { ignoreElements, Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class UserService {

    // private isFound: boolean;
    // private chatEndUsername: string;
    // private user: User;

    constructor(private cookieService: CookieService, private http: HttpClient, private router: Router) {
        this.loginWithJWT().subscribe(data => {
            console.log('username: ' + data.username + ' id: ' + data.id);
            this.saveCookie('currentUser', data)
            this.router.navigateByUrl('/home');
        });
        // this.isFound = false;
        // this.chatEndUsername = "";
    }

    register(username: string, password: string): Observable<any> {

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

        return this.http.post<any>('http://localhost:4000/user/create', raw, requestOptions)
    }

    loginWithUsernameAndPassword(username: string, password: string): Observable<Jwt> {

        console.log('xxx ' + username + " " + password);
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

       return this.http.post<Jwt>('http://localhost:4000/login', urlencoded, { headers });
    }

    checkUsername(username: string): Observable<string> {
        console.log('checking user ' + username);
        
        const headers = new HttpHeaders().set("Content-Type", "text/plain")
        const reqOptions: Object = {
            headers: headers,
            responseType: 'text'
        }
        const req = this.http.get<string>('http://localhost:4000/user/checkUsername/' + username, reqOptions);
        return req;
    }

    loginWithJWT(): Observable<User> {
        const access_token = this.getCookie(('jwt')).access_token;
        console.log('access token from cookies: ' + access_token);
        
        const headers = { "Content-Type": "application/json", "Authorization": "Bearer " + access_token};
        const requestOptions = {
            method: 'POST',
            headers: headers,
            redirect: 'follow'
        };

        const req = this.http.get<User>('http://localhost:4000/user/login/', { headers });
        return req;
        
    }

    logout(): void {
        this.deleteCookies();
        this.router.navigateByUrl('/');
    }

    saveCookie(key: string, data: any) {
        this.cookieService.set(key, JSON.stringify(data));
    }

    getCookie(key: string): any {
        return JSON.parse(this.cookieService.get(key) || '{}');
    }

    deleteCookies(): void {
        this.cookieService.deleteAll();
    }

    getLocalUser() {
        return this.getCookie('currentUser');
    }

    // setIsfound(value: boolean): void {
    //     this.isFound = value;
    // }

    // getIsFound(): boolean {
    //     return this.isFound;
    // }

    // setChatEndUsername(username: string): void {
    //     this.chatEndUsername = username;
    // }

    // getChatEndUsername(): string {
    //     return this.chatEndUsername;
    // }

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
