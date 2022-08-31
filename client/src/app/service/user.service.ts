import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { ignoreElements, Observable, Subject } from "rxjs";
import { Globals } from "../utils/globals"
import { ChatService } from "./chat.service";

@Injectable({
    providedIn: "root",
})
export class UserService {

    user: User | undefined;
    
    // chatRooms: Map<string, object> = new Map<string, object>();
    userChange: Subject<User | undefined> = new Subject<User | undefined>();

    constructor(private cookieService: CookieService, private http: HttpClient, private router: Router) {
        this.userChange.subscribe((value: User | undefined) => {
            this.user = value;
            console.log("user " + value);
            
            
        })
        this.loginWithJWT().subscribe(data => {
            this.user = data;
            this.userChange.next(data);
            this.saveCookie("currentUser", data);
            this.router.navigateByUrl("/home");
        });
    }

    register(username: string, password: string): Observable<any> {

        const headers = { "Content-Type": "application/json"}
        const raw = JSON.stringify({
            "username": username,
            "password": password,
            "roles": ["USER"]
        });

        const requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return this.http.post<any>(Globals.API_ENDPOINT + "/user/create", raw, requestOptions)
    }

    loginWithUsernameAndPassword(username: string, password: string): Observable<Jwt> {
        const headers = {"Content-Type": "application/x-www-form-urlencoded"};
        const urlencoded = new URLSearchParams();
        urlencoded.append("username", username);
        urlencoded.append("password", password);

        const requestOptions = {
            method: "POST",
            headers: headers,
            body: urlencoded,
            redirect: "follow"
        };

       return this.http.post<Jwt>(Globals.API_ENDPOINT + "/login", urlencoded, { headers });
    }

    checkUsername(username: string): Observable<string> {
        
        const headers = new HttpHeaders().set("Content-Type", "text/plain")
        const reqOptions: Object = {
            headers: headers,
            responseType: "text"
        }
        const req = this.http.get<string>(Globals.API_ENDPOINT + "/user/checkUsername/" + username, reqOptions);
        return req;
    }

    loginWithJWT(): Observable<User> {
        const access_token = this.getCookie(("jwt")).access_token;
        console.log("access token from cookies: " + access_token);
        
        const headers = { "Content-Type": "application/json", "Authorization": "Bearer " + access_token};
        const requestOptions = {
            method: "POST",
            headers: headers,
            redirect: "follow"
        };

        const req = this.http.get<User>(Globals.API_ENDPOINT + "/user/login/", { headers });
        return req;
        
    }

    logout(): void {
        this.userChange.next(undefined);
        this.deleteCookies();
        this.router.navigateByUrl("/");
    }

    saveCookie(key: string, data: any) {
        this.cookieService.set(key, JSON.stringify(data));
    }

    getCookie(key: string): any {
        return JSON.parse(this.cookieService.get(key) || "{}");
    }

    deleteCookies(): void {
        this.cookieService.deleteAll();
    }

    getLocalUser() {
        return this.getCookie("currentUser");
    }

    getUser(): User | undefined {
        return this.user;
    }
}

export interface User {
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
