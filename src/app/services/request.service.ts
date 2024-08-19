import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(
    private http: HttpClient,
  ) {
  }

  public get(url: string, options?: unknown): Observable<any> {
    return options ? this.http.get(url, options) : this.http.get(url);
  }
}
