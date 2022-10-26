import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { C2okieService } from './c2okie.service.service';
import { Jwt, UserService } from './user.service';

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
    const token = this.c2okieService.getCookie("jwt") as Jwt;
    const jwttoken = req.clone({
      setHeaders: {
        Authorization: 'bearer ' + token.access_token,
      },
    });
    return next.handle(jwttoken);
  }
}
