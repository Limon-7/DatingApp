import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { from, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth';
  jwtHelper = new JwtHelperService();
  decodedToken: any ;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) { }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }
  login(credential: any) {
    return this.http.post(this.baseUrl + '/' + 'login', credential).pipe(
      map(response => {
        const user = response;
        // tslint:disable-next-line: no-string-literal
        if (user && user['token']) {
          // tslint:disable-next-line: no-string-literal
          localStorage.setItem('token', user['token']);
          // tslint:disable-next-line: no-string-literal
          localStorage.setItem('user', JSON.stringify(user['userphoto']));
          // tslint:disable-next-line: no-string-literal
          this.decodedToken = this.jwtHelper.decodeToken(user['token']);
          // tslint:disable-next-line: no-string-literal
          this.currentUser = user['userphoto'];
          this.changeMemberPhoto(this.currentUser.photoUrl);
          console.log(this.decodedToken);
        }
      })
    );
  }
  register(user: User) {
   return this.http.post(this.baseUrl + '/' + 'register', user);
  }
  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
    // return this.authservice.isloggedIn();
  }
}
