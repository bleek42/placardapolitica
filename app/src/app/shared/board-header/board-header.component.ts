import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import Utils from 'src/app/utils';
import { TranslateService } from '@ngx-translate/core'; //added this
import { AppStateService } from 'src/app/app-state.service';


@Component({
  selector: 'app-board-header',
  templateUrl: './board-header.component.html',
  styleUrls: ['./board-header.component.scss']
})
export class BoardHeaderComponent implements OnInit {
  @Input()
  board: any = {};
  manyBoards = false;

  @Input()
  type;

  @Input()
  changeData;

  owner = false;

  constructor(
    public appState: AppStateService,
    private http: HttpClient,
    public route: ActivatedRoute,
    translate: TranslateService
  ) { }

  ngOnInit(): void {

    if (this.board) {
      this.initData();
      return;
    }
    this.route.params.subscribe(params => {
      Utils.get(this.http, `/boards/${params.board_id}`)
        .subscribe((board) => {
          this.board = board;
          this.initData();
        });
    });

  }

  initData() {
    let total = 0;
    if (this.board.senate) {
      total++;
    }
    if (this.board.house) {
      total++;
    }
    if (this.board.state) {
      total++;
    }
    if (this.board.city) {
      total++;
    }
    if (total > 1) {
      this.manyBoards = true;
    }

    if (this.appState.user) {
      const u = this.appState.getUserObject();
      if (u && u._id === this.board.owner) {
        this.owner = true;
      }
    }

  }

}
