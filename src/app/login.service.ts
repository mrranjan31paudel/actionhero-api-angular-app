import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  loginUser(loginData: { email: string, password: string }) {
    return this.http.post<any>(
      `${environment.baseApiUrl}/auth/login`,
      {
        ...loginData
      }
    );
  }
}
