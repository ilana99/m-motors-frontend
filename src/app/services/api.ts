import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private apiUrl = environment.apiUrl;
  private httpOptions = {
    observe: 'response' as const,
    withCredentials: true,
  };

  constructor(private Http: HttpClient) { }

  login(data: any): Observable<HttpResponse<any>> {
    return this.Http.post<any>(`${this.apiUrl}/auth/loginUser`, data, this.httpOptions);
  }

  me(): Observable<HttpResponse<any>> {
    return this.Http.get<any>(`${this.apiUrl}/auth/me`, this.httpOptions);
  }

  getProfile(): Observable<HttpResponse<any>> {
    return this.Http.get<any>(`${this.apiUrl}/user/profile`, this.httpOptions);
  }

  getMyClientfiles(): Observable<HttpResponse<any>> {
    return this.Http.get<any>(`${this.apiUrl}/clientfile/me`, this.httpOptions);
  }

  cancelMyClientfile(): Observable<HttpResponse<any>> {
    return this.Http.post<any>(`${this.apiUrl}/clientfile/me/cancel`, {}, this.httpOptions);
  }

  findOneClientfile(id: string): Observable<HttpResponse<any>> {
    return this.Http.get<any>(`${this.apiUrl}/clientfile/${id}`, this.httpOptions);
  }

  signup(data: any): Observable<HttpResponse<any>> {
    return this.Http.post<any>(`${this.apiUrl}/auth/signup`, data, this.httpOptions);
  }

  logout(): Observable<HttpResponse<any>> {
    return this.Http.post<any>(`${this.apiUrl}/auth/logout`, {}, this.httpOptions);
  }

  findAllCars(): Observable<HttpResponse<any>> {
    return this.Http.get<any>(`${this.apiUrl}/cars/status/available`, this.httpOptions);
  }

  findOneCar(id: string): Observable<HttpResponse<any>> {
    return this.Http.get<any>(`${this.apiUrl}/cars/${id}`, this.httpOptions);
  }

  submitClientFile(data: FormData): Observable<HttpResponse<any>> {
    return this.Http.post<any>(`${this.apiUrl}/clientfile/`, data, this.httpOptions);
  }

}
