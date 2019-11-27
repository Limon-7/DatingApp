import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth';
  jwtHelper = new JwtHelperService();
  decodedToken: any ;
  constructor(private http: HttpClient) { }
  login(credential: any) {
    return this.http.post(this.baseUrl + '/' + 'login', credential).pipe(
      map(response => {
        const user = response;
        // tslint:disable-next-line: no-string-literal
        if (user && user['token']) {
          // tslint:disable-next-line: no-string-literal
          localStorage.setItem('token', response['token']);
          // tslint:disable-next-line: no-string-literal
          this.decodedToken = this.jwtHelper.decodeToken(response['token']);
          console.log(this.decodedToken);
        }
      })
    );
  }
  register(model: any) {
   return this.http.post(this.baseUrl + '/' + 'register', model);
  }
  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
    // return this.authservice.isloggedIn();
  }
}
