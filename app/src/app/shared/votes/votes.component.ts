import { Component, OnInit, Input } from '@angular/core';
import Utils from 'src/app/utils';
import { HttpClient } from '@angular/common/http';
import { AppStateService } from 'src/app/app-state.service';

@Component({
  selector: 'app-votes',
  templateUrl: './votes.component.html',
  styleUrls: ['./votes.component.scss']
})
export class VotesComponent implements OnInit {

  @Input()
  votes = [];

  @Input()
  boardId;

  @Input()
  board;

  @Input()
  update;

  @Input()
  politic;

  owner = false;

  constructor(
    public http: HttpClient,
    public appState: AppStateService
  ) { }

  ngOnInit(): void {
    if (!this.board) {
      this.board = this.appState.board;
    }

    if (this.appState.user) {
      const u = this.appState.getUserObject();
      if (u && u._id === this.board.owner) {
        this.owner = true;
      }
    }
    if (this.politic) {
      this.votes = this.votes.filter(v => v.politic === this.politic._id);
    }
  }


  changeStatus(voteid, status) {
    Utils.patch(this.http, `/votes/${this.boardId}/${voteid}`, {
      status
    })
      .subscribe(() => {
        if (this.update) {
          this.update();
        }
      });
  }

}
