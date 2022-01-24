import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account.service';
import { User } from 'src/app/shared/models/iUser';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private accountService: AccountService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        let currentUser: User;

        this.accountService.currentUserObservable$
            .pipe(take(1)).subscribe(user => currentUser = user);
        console.log('user:', currentUser);
        if (currentUser) {
            console.log('user:', currentUser);
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            })
        }

        return next.handle(request);
    }
}