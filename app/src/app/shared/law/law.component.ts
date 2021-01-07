import { Component, OnInit, Input } from '@angular/core';
import Utils from 'src/app/utils';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-law',
  templateUrl: './law.component.html',
  styleUrls: ['./law.component.scss']
})
export class LawComponent implements OnInit {
  @Input()
  board;

  @Input()
  law;

  @Input()
  addLaw;

  @Input()
  owner;

  votations;
  votation;
  votes;

  message;
  constructor(
    public http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  getVotations(votationId) {
    this.message = 'Carregando votos...';
    Utils.get(this.http, `/votes/update/house/proposition/${this.board._id}/${votationId}`)
      .subscribe(data => {
        this.message = null;
        this.votations = data;
      });

  }


  getVotes(votation) {
    this.votation = votation;
    this.message = 'Carregando votos...';
    Utils.get(this.http, `/votes/update/house/vote/${this.board._id}/${votation.id}`)
      .subscribe(data => {
        this.message = null;
        this.votes = data;
      });
  }


  saveVotes() {
    Utils.post(this.http, `/votes/update/house/vote/${this.board._id}/${this.votation.id}`, {
      votes: this.votes,
      votation: this.votation,
      law: this.law
    })
      .subscribe(data => {
        this.message = 'Votos importados com sucesso!';
        this.votations = null;
        this.votes = null;
      });
  }

}
