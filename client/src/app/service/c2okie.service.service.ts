import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class C2okieService extends CookieService {

  saveCookie(key: string, data: any) {
    this.set(key, JSON.stringify(data));
  }

  getCookie(key: string): any {
    return JSON.parse(this.get(key) || "{}");
  }
}
