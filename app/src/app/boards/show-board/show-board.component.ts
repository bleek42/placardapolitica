import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Utils from 'src/app/utils';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core'; //added this
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, flatMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { PoliticBoardComponent } from '../politic-board/politic-board.component';
import { AppStateService } from 'src/app/app-state.service';

@Component({
  selector: 'app-show-board',
  templateUrl: './show-board.component.html',
  styleUrls: ['./show-board.component.scss']
})
export class ShowBoardComponent implements OnInit {
  boardId: any = null;
  board;
  type = 'house';
  votes = [];
  parties: any = [];
  partiesObject = {};
  politics = [];
  allPolitics = [];
  politicsHouse: any = [];
  politicsSenate: any = [];
  yespolitics = [];
  nopolitics = [];
  unpolitics = [];
  manyBoards = false;
  states: any = [];
  statesObject = {};

  statesFilter: any = [];
  partiesFilter: any = [];

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    translate: TranslateService,
    public appStore: AppStateService
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.boardId = params.board_id;
      if (params.type) {
        this.type = params.type;
      }
      this.getData();
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPolitic(value))
    );

  }


  displayFn(user: any): string {
    return user && user.name ? user.name : '';
  }

  private _filterPolitic(value: any): string[] {
    const filterValue = value.name ? value.name.toLowerCase() : value.toLowerCase();
    return this.politics.filter(politic => politic.name.toLowerCase().indexOf(filterValue) >= 0);
  }

  async initData(filter = null) {
    let pol;
    if (this.board.house && !this.board.senate) {
      this.type = 'house';
    } else if (this.board.senate && !this.board.house) {
      this.type = 'senate';
    }
    if (this.type === 'senate') {
      pol = this.politicsSenate;
    } else {
      pol = this.politicsHouse;
    }
    if (filter) {
      pol = pol.filter(filter);
    }

    this.partiesObject = {};
    this.parties.forEach(p => {
      this.partiesObject[p.short_name.toLowerCase()] = p;
      this.partiesObject[p.name.toLowerCase()] = p;
    });

    this.politics = pol.map(p => {
      const party = this.partiesObject[p.partyName.toLowerCase()] || this.partiesObject[p.name.toLowerCase()];

      if (party) {
        p.partyId = party.id;
      } else {
        console.warn(`party not found`, p.full_name, p.partyName);
      }
      this.statesObject[p.state] = p.state;
      return p;
    });
    this.states = Object.values(this.statesObject).sort((a, b) => a > b ? 1 : -1);

    if (this.board.propositions.length > 0) {
      const found = this.board.propositions.find(p => p.type === this.type);
      if (found && found.proposition.votations.length > 0) {
        const originalId = found.proposition.votations[0].originalId;
        Utils.get(this.http, `/votes/votation/${originalId}`)
          .subscribe(d => {
            this.votes = d;
            this.initPoliticsVotes();
          });
        return;
      }
    }
    this.initPoliticsVotes();
  }

  initPoliticsVotes(politics = this.politics) {
    const politicObject = {};

    this.allPolitics.forEach(p => {
      politicObject[p._id] = p;
    });
    const politicsInformed = {};
    const politicsYes = {};
    const politicsNo = {};
    this.votes.forEach(vote => {
      const politicFound = politicObject[vote.politic];
      politicsInformed[vote.politic] = politicFound;

      if (!politicFound) {
        console.warn(`What Politic?`, vote, this.allPolitics);
      }

      if (Boolean(vote.value) === true) {
        politicsYes[vote.politic] = politicFound;
      } else if (Boolean(vote.value) === false) {
        politicsNo[vote.politic] = politicFound;
      } else {
        console.warn(`What value?`, vote, this.allPolitics);
      }
    });

    if (this.board.valueType === 'boolean') {
      this.yespolitics = Object.values(politicsYes);
      this.nopolitics = Object.values(politicsNo);
      this.unpolitics = politics.filter(c => !politicsYes[c._id] && !politicsNo[c._id] && c.type == this.type);
    } else {
      this.yespolitics = Object.values(politicsInformed);
      this.unpolitics = [];
    }

  }

  getData() {
    Utils.get(this.http, `/boards/${this.boardId}`)
      .pipe(
        flatMap(board => {
          this.appStore.board = this.board = board;
          return Utils.get(this.http, '/politics/?country=' + this.board.country)
        })
      )
      .pipe(
        flatMap(pol => {
          this.allPolitics = pol;
          this.politicsSenate = pol.filter(p => p.type === 'senate');
          this.politicsHouse = pol.filter(p => p.type === 'house');
          return Utils.get(this.http, `/politics/parties/?country=` + this.board.country);
        })
      )
      .pipe(
        flatMap(par => {
          this.parties = par;
          return Utils.get(this.http, '/votes/' + this.board._id);
        })
      )
      .subscribe((votes: any) => {
        this.votes = votes;
        this.initData();
      });
  }


  changeData(type) {
    this.type = type;
    this.initData();
  }

  searchOpenDialog(politic) {
    const dialogRef = this.dialog.open(PoliticBoardComponent, {
      data: {
        politic,
        boardId: this.boardId,
        votes: this.votes
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  searchParty(e) {
    this.partiesFilter = this.toggle(this.partiesFilter, e.source.value, e.source._selected);
    const pol = this.filterPolitics();
    this.initPoliticsVotes(pol);
  }

  searchState(e) {
    this.statesFilter = this.toggle(this.statesFilter, e.source.value, e.source._selected);
    const pol = this.filterPolitics();
    this.initPoliticsVotes(pol);
  }

  filterPolitics() {
    let pol = this.politics;
    if (this.partiesFilter.length > 0) {
      pol = pol.filter(p => this.partiesFilter.find(f => f === p.party));
    }
    if (this.statesFilter.length > 0) {
      pol = pol.filter(p => this.statesFilter.find(f => f === p.state));
    }
    return pol;
  }

  toggle(arr, val, insert = true) {
    if (insert) {
      arr.push(val);
      return arr;

    } else {
      return arr.filter(a => a !== val);
    }
  }


}
