import { Component, OnInit, Inject, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Utils from 'src/app/utils';
import { AppStateService } from 'src/app/app-state.service';

@Component({
  selector: 'app-vote-create',
  templateUrl: './vote-create.component.html',
  styleUrls: ['./vote-create.component.scss']
})
export class VoteCreateComponent implements OnInit {
  board;

  @Input()
  city: any = {};

  @Input()
  politic: any = null;

  update;
  type = 'city';

  formOpen = true;

  @Input()
  votes;

  cityForm = this.fb.group({
    value: [''],
    link: [''],
    description: ['']
  });

  constructor(
    public http: HttpClient,
    private fb: FormBuilder,
    public appStore: AppStateService,
    private dialogRef: MatDialogRef<VoteCreateComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.city = data.city;
    this.board = data.board;
    this.update = data.update;
    this.type = data.type;
  }

  ngOnInit(): void {
    if (!this.board) {
      this.board = this.appStore.board;
    }
  }

  submit() {
    Utils.post(this.http, `/votes/${this.board._id}`, {
      ...this.cityForm.value,
      type: this.type,
      boardId: this.board._id,
      geo: this.city ? this.city._id : null,
      politic: this.politic ? this.politic._id : null
    })
      .subscribe(data => {
        this.formOpen = false;
        if (this.votes) {
          this.votes.push(data);
        }

        if (this.update) {
          this.update();
        }
      });
  }



}
