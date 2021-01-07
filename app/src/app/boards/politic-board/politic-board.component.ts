import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { EnterComponent } from 'src/app/users/enter/enter.component';
import { AppStateService } from 'src/app/app-state.service';

@Component({
  selector: 'app-politic-board',
  templateUrl: './politic-board.component.html',
  styleUrls: ['./politic-board.component.scss']
})
export class PoliticBoardComponent implements OnInit {
  politic;
  boardId;
  votes;
  inform = false;
  constructor(
    public appStore: AppStateService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.politic = data.politic;
    this.boardId = data.boardId;
    this.votes = data.votes;
  }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogRef = this.dialog.open(EnterComponent, {
      data: {
        politic: this.politic,
        boardId: this.boardId,
        votes: this.votes
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
