import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class C2okieService extends CookieService {

  setObject(key: string, data: any) {
    this.set(key, typeof data === 'string' ? JSON.stringify(data) : data);
  }

  getObject(key: string): any {
    return JSON.parse(this.get(key) || "{}");
  }
}
