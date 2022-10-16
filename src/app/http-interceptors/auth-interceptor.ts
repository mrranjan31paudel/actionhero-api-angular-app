import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    if (req.url.startsWith(environment.baseApiUrl)) {  // Only send tokens for main service API
      req = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + (localStorage.getItem('accessToken') || ''))
      });
    }

    return next.handle(req);
  }
}
