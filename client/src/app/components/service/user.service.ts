import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";

class UserService {

    private user: User | undefined;

    constructor(private cookieService: CookieService, private http: HttpClient) {
        
    }

    checkUser() {

    }

    register(username: string, password: string) {
        const headers = { "Content-Type": "application/json"};
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

        const req = this.http.post<any>('http://localhost:4000/user/register', requestOptions).subscribe(data => {
        console.log(data);
        
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

    }

    getUser(id: bigint) {
        
    }

    private saveLocalUser(data: any) {
        this.cookieService.set('currentUser', data);
    }

    private getLocalUser() {
        this.cookieService.get('currentUser');
    }


}

interface User {
    username: string,
    roles: []
}

interface Jwt {
    access_token: string,
    refresh_token: string
}