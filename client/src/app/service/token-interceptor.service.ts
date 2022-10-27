import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { C2okieService } from './c2okie.service.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(
    private readonly userService: UserService,
    private readonly c2okieService: C2okieService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    console.log("intercepting request " + req.url);


    const token = this.c2okieService.get("jwt");
    const currentUser = this.userService.getUser();
    const resApi = req.url.startsWith(environment.API_ENDPOINT + '/api/res');

    if(resApi) {
      console.log("intercept ok " + token);

      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
        },
      });
    }

    return next.handle(req);
  }
}
