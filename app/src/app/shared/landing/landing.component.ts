import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Utils from 'src/app/utils';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  title = 'app';
  boards = [];
  constructor(
    private http: HttpClient,
    translate: TranslateService
    ) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    Utils.get(this.http, '/boards')
      .subscribe(pol => {

        this.boards = pol;
      });
  }

}
