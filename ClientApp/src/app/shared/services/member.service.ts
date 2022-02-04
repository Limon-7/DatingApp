import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IMember, IPaginateMember } from '../models/iMember';
import { IUser } from '../models/iUser';
import { UserParams } from '../params/user-params';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = environment.apiUrl;
  members: IMember[] = [];
  memberCache = new Map();
  user: IUser;

  queryParams = new UserParams();
  pagination = new IPaginateMember();
  constructor(private http: HttpClient) { }

  getUsers(): Observable<IPaginateMember> {
    let params = new HttpParams();
    // const observable =
    return this.http.get<IPaginateMember>(`${this.baseUrl}user`,
      { observe: 'response', params }).pipe(
        map(response => {
          this.pagination = response.body;
          return this.pagination;
        })
      );
  }
  getMembers(): Observable<IMember[]> {
    return this.http.get<IMember[]>(`${this.baseUrl}user`);
  }
  getMember(userName: string): Observable<IMember> {
    return this.http.get<IMember>(`${this.baseUrl}user/${userName}`);
  }

  updateMember(model: IMember) {
    return this.http.put(`${this.baseUrl}user`, model);
  }


  getParams = (): UserParams => this.queryParams;
  setParams = (params: UserParams): UserParams => this.queryParams = params;
}
