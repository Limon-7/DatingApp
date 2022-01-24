import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from 'src/app/shared/models/iUser';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;

  private currentUser = new ReplaySubject<IUser>(1);
  currentUserObservable$ = this.currentUser.asObservable();
  constructor(private http: HttpClient) { }

  login(model: any): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/login`, model).pipe(map((ressponse: IUser) => {
      const user = ressponse;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.setCurrentUser(user);
      }
    }))
  }

  register(model: any): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/register`, model).pipe(map((ressponse: IUser) => {
      const user = ressponse;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.setCurrentUser(user);
      }
    }))
  }

  logout(): void {
    localStorage.removeItem("user");
    this.currentUser.next(null);
  }

  setCurrentUser(user: IUser): void {
    this.currentUser.next(user);
  }
}
