import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment';
import { IMessage } from '../models/iMessage';
import { PaginatedResult } from '../models/iPaginate';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  getMessages(pageNumber, pageSize, container) {
    let params = this.getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return this.getPaginatedResult<IMessage[]>(this.baseUrl + 'messages', params);
  }

  getMessageThread(username: string) {
    return this.http.get<IMessage[]>(this.baseUrl + 'messages/thread/' + username);
  }

  sendMessage(username: string, content: string) {
    return this.http.post<IMessage>(this.baseUrl + 'messages', {recipientUsername: username, content})
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }

  getPaginationHeaders(pageNumber: Number, pageSize: Number) {
    let params = new HttpParams();

    params = params.append("pageNumber", pageNumber.toString());
    params = params.append("pageSize", pageSize.toString());
    return params;
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
}
