import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberListResolver implements Resolve<User> {
    constructor(private userServices: UserService, private alertify: AlertifyService, private router: Router) { }
    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userServices.getUsers().pipe(
            catchError(err => {
                this.alertify.error('Problem Retriving Data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}
