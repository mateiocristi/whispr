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

    checkUser(username: string) {
        const headers = { "Content-Type": "application/json"}
        const req = this.http.get('http://localhost:4000/user/checkUsername/' + username, { headers });
        req.subscribe(response => {
            console.log('resp ' + response);
            
        })
    }

    register(username: string, password: string) {

        this.checkUser(username);
        // const headers = { "Content-Type": "application/json"}
        // const raw = JSON.stringify({
        //     "username": username,
        //     "password": password,
        //     "roles": ["USER"]
        // });

        // const requestOptions = {
        //     method: 'POST',
        //     headers: headers,
        //     body: raw,
        //     redirect: 'follow'
        // };

        // this.http.post<any>('http://localhost:4000/user/create', raw, requestOptions).subscribe(data => {
        //     console.log(data)
        // });
    }

    login(username: string, password: string) {

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

       this.http.post<Jwt>('http://localhost:4000/login', urlencoded, { headers }).subscribe(
        jwt => {
            console.log('jwt ' + jwt);
            
            this.saveCookie('jwt', jwt);
            console.log('jwt ' + (this.getCookie('jwt') || '{}'));
            ;
            this.getUser(username);
        }
       );
        
        

    }

    private getUser(username: string) {
        const headers = { "Content-Type": "application/json", "Authorization": "Bearer " + this.getCookie(('jwt') || '{}').access_token};
        const requestOptions = {
            method: 'POST',
            headers: headers,
            redirect: 'follow'
        };

        const req = this.http.get<User>('http://localhost:4000/user/get/' + username , { headers });
        console.log("retrieved user: " + req);
        req.subscribe(data => {
            console.log('data ' + data.username);
            
            this.saveCookie('currentUser', data)
        })
        
    }

    private saveCookie(key: string, data: any) {
        this.cookieService.set(key, JSON.stringify(data));
    }

    private getCookie(key: string) {
        return JSON.parse(localStorage.getItem(key) || '{}');
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
