import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Utils from 'src/app/utils';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.scss']
})
export class CreateBoardComponent implements OnInit {


  valueTypes = ['boolean', 'currency', 'number', 'date'];
  countries = ['br', 'us'];

  boardForm = this.fb.group({
    title: [''],
    description: [''],
    house: [''],
    city: [''],
    state: [''],
    senate: [''],
    valueType: [''],
    country: [''],
    lawHouse: [''],
    lawSenate: ['']
  });

  lawsHouse;
  lawHouse;
  lawsSenate;
  lawSenate;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private fb: FormBuilder,
    private http: HttpClient) { }

  ngOnInit(): void {
  }

  submit() {
    const board = {
      ... this.boardForm.value,
      lawHouse: this.lawHouse,
      lawSenate: this.lawSenate
    };
    Utils.post(this.http, `/boards`, board)
      .subscribe((newBoard: any) => {
        this.router.navigate([`boards/${newBoard.slug}`]);
      });
  }

  searchLaw() {
    let law = this.boardForm.value.lawHouse;
    law = law.replace(/\s/g, '');
    const vals = law.split('/');

    const year = vals.length > 1 ? vals[1] : null;
    const type = vals[0].replace(/[0-9]/g, '');
    const numberLaw = vals[0].replace(/[A-Z]/g, '');

    this.lawHouse = this.lawsHouse = null;
    Utils.get(this.http, `/politics/law/br/house/${type}/${numberLaw}/${year ? year : ''}`)
      .subscribe((laws: any) => {
        if (laws.length > 1) {
          this.lawsHouse = laws;
        } else if (laws.length === 1) {
          this.lawHouse = laws[0];
        }
      });
  }


  searchLawSenate() {
    let law = this.boardForm.value.lawHouse;
    law = law.replace(/\s/g, '');
    const vals = law.split('/');

    const year = vals.length > 1 ? vals[1] : null;
    const type = vals[0].replace(/[0-9]/g, '');
    const numberLaw = vals[0].replace(/[A-Z]/g, '');

    this.lawSenate = this.lawsSenate = null;
    Utils.get(this.http, `/politics/law/br/senate/${type}/${numberLaw}/${year ? year : ''}`)
      .subscribe((laws: any) => {
        if (laws.length > 1) {
          this.lawsSenate = laws;
        } else if (laws.length === 1) {
          this.lawSenate = laws[0];
        }
      });
  }
  addLawHouse(law) {
    this.lawHouse = law;
    this.lawsHouse = null;
  }

  addLawSenate(law) {
    this.lawSenate = law;
    this.lawsSenate = null;
  }

}
