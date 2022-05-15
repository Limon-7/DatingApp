import { PlatformLocation } from "@angular/common";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AccountService } from "src/app/shared/services/account.service";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private location: PlatformLocation
  ) {}
  canActivate(): Observable<boolean> {
    return this.accountService.currentUserObservable$.pipe(
      map((user) => {
        if (user.roles.includes("Admin") || user.roles.includes("Moderator"))
          return true;
        else {
          this.toastr.error("You can not enter this page", "Forbidden");
          this.location.back();
        }
      })
    );
  }
}
