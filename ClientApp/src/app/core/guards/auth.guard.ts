import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccountService } from 'src/app/shared/services/account.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private accountService: AccountService, private router: Router, private toastr: ToastrService) { }
    canActivate(): Observable<boolean> {
        return this.accountService.currentUserObservable$.pipe(
            map(user => {
                if (user) return true;
                this.toastr.error('Accesss denied')
            })
        )
    }
}
