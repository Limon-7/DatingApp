import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IUser } from "src/app/shared/models/iUser";
import { Observable, ReplaySubject } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  baseUrl = environment.apiUrl;

  private currentUser = new ReplaySubject<IUser>(1);
  currentUserObservable$ = this.currentUser.asObservable();
  constructor(private http: HttpClient, private router: Router) {}

  login(model: any): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/login`, model).pipe(
      map((ressponse: IUser) => {
        const user = ressponse;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          this.setCurrentUser(user);
        }
      })
    );
  }

  register(model: any): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/register`, model).pipe(
      map((ressponse: IUser) => {
        const user = ressponse;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          this.setCurrentUser(user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem("user");
    this.currentUser.next(null);
    this.router.navigate(["/"]);
  }

  setCurrentUser(user: IUser): void {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles);
    this.currentUser.next(user);
  }

  getDecodedToken(token) {
    return JSON.parse(atob(token.split(".")[1]));
  }
}
