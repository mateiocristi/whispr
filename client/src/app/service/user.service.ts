import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { ignoreElements } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class UserService {

    private user: User | undefined;

    constructor(private cookieService: CookieService, private http: HttpClient, private router: Router) {}

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
            console.log(data);
        });
    }

    loginWithUsernameAndPassword(username: string, password: string) {

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
            console.log('jwt ' + jwt.access_token + 'refresh ' +jwt.refresh_token);
            
            this.saveCookie('jwt', jwt);
            console.log('jwt ' + (this.getCookie('jwt') || '{}').access_token);
            ;
            this.loginWithJWT();
        }
       );
    }

    checkUsername(username: string) {
        const headers = new HttpHeaders().set("Content-Type", "text/plain")
        const reqOptions: Object = {
            headers: headers,
            responseType: 'text'
        }
        const req = this.http.get<string>('http://localhost:4000/user/checkUsername/' + username, reqOptions);
        return req;
    }

    public loginWithJWT() {
        const access_token = this.getCookie(('jwt')).access_token;
        console.log('access token from cookies: ' + access_token);
        
        const headers = { "Content-Type": "application/json", "Authorization": "Bearer " + access_token};
        const requestOptions = {
            method: 'POST',
            headers: headers,
            redirect: 'follow'
        };

        const req = this.http.get<User>('http://localhost:4000/user/login/', { headers });
        console.log("retrieved user: " + req);
        req.subscribe(data => {
            console.log('data ' + data.username);
            this.saveCookie('currentUser', data)
            this.router.navigateByUrl('/home');
        })
        
    }

    private saveCookie(key: string, data: any) {
        this.cookieService.set(key, JSON.stringify(data));
    }

    private getCookie(key: string): any {
        return JSON.parse(this.cookieService.get(key) || '{}');
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
