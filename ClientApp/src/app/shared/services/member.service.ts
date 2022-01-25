import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IMember } from '../models/iMember';
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
  userParams: UserParams;
  constructor(private http: HttpClient) { }

  getMembers(): Observable<IMember[]> {
    return this.http.get<IMember[]>(`${this.baseUrl}user`);
  }
  getMember(userName: string): Observable<IMember> {
    return this.http.get<IMember>(`${this.baseUrl}user/${userName}`);
  }

  updateMember(model: IMember) {
    return this.http.put(`${this.baseUrl}user`, model);
  }
}
