import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  public handleError(response: any): Observable<any> {
    return throwError(response);
  }
}
