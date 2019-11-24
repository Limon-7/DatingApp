import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = 'http://localhost:5000/auth';
  jwtHelper = new JwtHelperService();
  decodedToken: any ;
  constructor(private http: HttpClient) { }
  login(credential: any) {
    return this.http.post(this.url + '/' + 'login', credential).pipe(
      map(response => {
        const user = response;
        if (user && user['token']) {
          localStorage.setItem('token', response['token']);
          this.decodedToken = this.jwtHelper.decodeToken(response['token']);
          console.log(this.decodedToken);
        }
      })
    );
  }
  register(model: any) {
   return this.http.post(this.url + '/' + 'register', model);
  }
  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
    // return this.authservice.isloggedIn();
  }
}
