import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Utils from 'src/app/utils';
import { AppStateService } from 'src/app/app-state.service';
import { TranslateService } from '@ngx-translate/core'; //added this

@Component({
  selector: 'app-list-board',
  templateUrl: './list-board.component.html',
  styleUrls: ['./list-board.component.scss']
})
export class ListBoardComponent implements OnInit {
  boards;
  house = null;
  senate = null;
  city = null;
  state = null;
  constructor(
    public appStore: AppStateService,
    private http: HttpClient,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    Utils.get(this.http, `/boards`)
      .subscribe(boards => {
        this.boards = boards;
        this.house = this.boards.filter(b => b.house).length;
        this.senate = this.boards.filter(b => b.senate).length;
        this.city = this.boards.filter(b => b.city).length;
        this.state = this.boards.filter(b => b.state).length;
      });
  }

}
