import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getUsers(page?, itemPerPages?, userParams?, likesParam?): Observable<PaginatedResult<User>> {
    const paginatedResult: PaginatedResult<User> = new PaginatedResult<User>();
    let params = new HttpParams();
    if (page != null && itemPerPages != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemPerPages);

    }
    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }
    if (likesParam === 'Likers') {
      params = params.append('likers', 'true');
    }
    if (likesParam === 'Likees') {
      params = params.append('likees', 'true');
    }
    return this.http.get<User>(this.baseUrl + 'user', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }
  getUserById(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'user/' + id);
  }
  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'user/' + id, user);
  }
  setMainPhoto(userId: number, id: number) {
    return this.http.put(this.baseUrl + 'user/' + userId + '/photos/' + id + '/setMain', {});
  }
  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'user/' + userId + '/photos/' + id);
  }
  checkUsernameAvailAvility(name: any) {
    return this.http.get(this.baseUrl + 'auth/' + 'checkUserName', name);
  }

  sendLike(id: number, recipentId: number) {
    return this.http.post(this.baseUrl + 'user/' + id + '/like/' + recipentId, {});
  }
}
