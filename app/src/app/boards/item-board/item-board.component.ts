import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-item-board',
  templateUrl: './item-board.component.html',
  styleUrls: ['./item-board.component.scss']
})
export class ItemBoardComponent implements OnInit {
  @Input()
  board: any = {};
  constructor(
    translate: TranslateService
  ) { }

  ngOnInit(): void {
  }

}
