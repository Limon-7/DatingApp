import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ListResolver implements Resolve<User> {
    pageNumber = 1;
    pageSize = 5;
    likesParam = 'Likers';
    constructor(private userServices: UserService, private alertify: AlertifyService, private router: Router) { }
    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userServices.getUsers(this.pageNumber, this.pageSize, null, this.likesParam).pipe(
            catchError(err => {
                this.alertify.error('Problem Retriving Data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}
