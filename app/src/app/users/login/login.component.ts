import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Utils from 'src/app/utils';
import { AppStateService } from 'src/app/app-state.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input()
  redirect = true;

  @Output() afterLogin = new EventEmitter<boolean>();

  loginForm = this.fb.group({
    user_name: '',
    password: ''
  });

  error = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    translate: TranslateService,
    public appStore: AppStateService,
    private http: HttpClient) { }

  ngOnInit(): void {

  }

  submit() {
    Utils.post(this.http, `/auth/login`, this.loginForm.value)
      .subscribe((pol: any) => {
        this.appStore.user = pol;
        localStorage.authToken = pol.authToken;
      },
        err => this.error = err.error.error,
        () => {
          if (this.redirect) { this.router.navigate(['/']); }
          this.afterLogin.emit(true);
        });
  }
}
