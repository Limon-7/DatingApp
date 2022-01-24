import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AccountService } from 'src/app/shared/services/account.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private accountService: AccountService, private router: Router, private alertify: AlertifyService) { }
    canActivate(): Observable<boolean> {
        return this.accountService.currentUserObservable$.pipe(
            map(user => {
                if (user) return true;
                this.alertify.error('Accesss denied')
            })
        )
    }
}
