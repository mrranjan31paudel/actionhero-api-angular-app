import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {
    const { value } = f;

    this.loginService.loginUser(value)
      .pipe(catchError((err, caught) => {
        return throwError(() => new Error(err.message));
      }))
      .subscribe((res: { data: { accessToken: string, refreshToken: string } }) => {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);

        this.router.navigate(['/home']);
      });
  }

}
