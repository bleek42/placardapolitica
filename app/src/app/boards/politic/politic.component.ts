import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { PoliticBoardComponent } from '../politic-board/politic-board.component';
import { TranslateService } from '@ngx-translate/core'; //added this


@Component({
  selector: 'app-politic',
  templateUrl: './politic.component.html',
  styleUrls: ['./politic.component.scss']
})
export class PoliticComponent implements OnInit {

  showimage;

  @Input()
  politic: any = {};

  @Input()
  votes: any = {};

  @Input()
  boardId: any = {};

  constructor(
    public dialog: MatDialog,
    translate: TranslateService
  ) { }

  ngOnInit(): void {
    let url = this.politic.originalId;
    if (this.politic.type === 'senate') {
      url = 'senador' + this.politic.originalId.split('/')[0];
    }
    this.showimage = 'assets/politics/br/' + url + '.jpg';
  }

  openDialog() {
    const dialogRef = this.dialog.open(PoliticBoardComponent, {
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

