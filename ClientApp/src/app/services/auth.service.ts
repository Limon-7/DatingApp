import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = 'http://localhost:5000/auth';
  // token: any ;
  constructor(private http: HttpClient) { }
  login(credential: any) {
    return this.http.post(this.url + '/' + 'login', credential).pipe(
      map(response => {
        const user = response;
        if (user) {
          localStorage.setItem('token', response['token']);
        }
      })
    );
  }
  register(model: any) {
   return this.http.post(this.url + '/' + 'register', model);
  }

}
