import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Utils from 'src/app/utils';
import { AppStateService } from 'src/app/app-state.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Input()
  redirect = true;

  @Output() afterRegister = new EventEmitter<boolean>();

  registerForm = this.fb.group({
    user_name: '',
    full_name: '',
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
    Utils.post(this.http, `/users`, this.registerForm.value)
      .subscribe(() => {
        Utils.post(this.http, `/auth/login`, this.registerForm.value)
          .subscribe((pol: any) => {
            this.appStore.user = pol;
            localStorage.authToken = pol.authToken;
          },
            err => this.error = err.error.error,
            () => {
              if (this.redirect) {
                this.router.navigate(['/']);
              }
              this.afterRegister.emit(true);
            }
          );
      },
        err => this.error = err.error.error);
  }

}
