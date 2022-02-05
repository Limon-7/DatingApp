import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IMember, IPaginateMember } from '../models/iMember';
import { PaginatedResult } from '../models/iPaginate';
import { IUser } from '../models/iUser';
import { UserParams } from '../params/user-params';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = environment.apiUrl;
  members: IMember[] = [];
  memberCache = new Map();
  user: IUser;

  queryParams: UserParams;
  pagination = new IPaginateMember();

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUserObservable$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.queryParams = new UserParams(user);
    })
  }

  getUsers(): Observable<IPaginateMember> {
    let params = new HttpParams();

    return this.http.get<IPaginateMember>(`${this.baseUrl}user`,
      { observe: 'response', params }).pipe(
        map(response => {
          this.pagination = response.body;
          return this.pagination;
        })
      );
  }
  getMembers(userParams: UserParams) {
    console.log("userParams:", Object.values(userParams).join('-'));
    let response = this.memberCache.get(Object.values(userParams).join('-'));
    console.log("response:", response);
    if (response) return of(response);


    let params = this.getPaginatedHeader(userParams.pageNumber, userParams.pageSize);
    params = params.append("minAge", userParams.minAge);
    params = params.append("maxAge", userParams.maxAge);
    params = params.append("gender", userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResult<IMember[]>(`${this.baseUrl}user`, params).pipe(
      map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }


  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this.http.get<T>(url, { observe: "response", params }).pipe(map(response => {
      paginatedResult.result = response.body;

      if (response.headers.get("Pagination") !== null) {
        paginatedResult.pagination = JSON.parse(response.headers.get("Pagination"));
      }

      return paginatedResult;
    }));
  }

  getMember(userName: string): Observable<IMember> {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: IMember) => member.userName === userName);
    if (member) return of(member);

    return this.http.get<IMember>(`${this.baseUrl}user/${userName}`);
  }

  updateMember(model: IMember) {
    return this.http.put(`${this.baseUrl}user`, model);
  }

  getPaginatedHeader(pageNumber: Number, pageSize: Number) {
    let params = new HttpParams();

    params = params.append("pageNumber", pageNumber.toString());
    params = params.append("pageSize", pageSize.toString());
    return params;
  }
  getParams = (): UserParams => this.queryParams;
  setParams = (params: UserParams): UserParams => this.queryParams = params;
  resetUserParams = (): UserParams => this.queryParams = new UserParams(this.user);
}
