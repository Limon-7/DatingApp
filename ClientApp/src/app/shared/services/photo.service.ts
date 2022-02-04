import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'photos/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'photos/' + photoId);
  }
}
