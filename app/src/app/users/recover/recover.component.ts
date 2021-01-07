import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Utils from 'src/app/utils';
import { AppStateService } from 'src/app/app-state.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss']
})
export class RecoverComponent implements OnInit {
  recoverForm = this.fb.group({
    email: ''
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

  //I am not sure of the route but it seemed to make sense.
  //Also, I am not sure if I messed up this entire file
  //but I just copy/paste from the login file and made some
  //minor changes. I will note the changes in the summary
  //and description of the push
  submit() {
    Utils.post(this.http, `/auth/recover`, this.recoverForm.value)
      .subscribe((pol: any) => {
        this.appStore.user = pol;
        localStorage.authToken = pol.authToken;
      },
        err => this.error = err.error.error,
        () => this.router.navigate(['/']));
  }

}
