import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
    constructor(private userServices: UserService, private alertify: AlertifyService,
        private router: Router, private authService: AuthService) { }
    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userServices.getUserById(this.authService.decodedToken.nameid).pipe(
            catchError(err => {
                this.alertify.error('Problem Retriving your Data');
                this.router.navigate(['/members']);
                return of(null);
            })
        );
    }
}
