import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  ticketId?: string;
}

@Injectable({ providedIn: 'root' })
export class LociwareApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.lociware.co.za';

  private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  contact(payload: ContactPayload): Observable<ContactResponse> {
    return this.http
      .post<ContactResponse>(`${this.baseUrl}/contact`, payload, { headers: this.headers })
      .pipe(catchError(err => throwError(() => err)));
  }

  getPortfolio(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/portfolio`);
  }

  getServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/services`);
  }
}
