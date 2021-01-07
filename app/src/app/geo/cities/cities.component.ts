import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import Utils from 'src/app/utils';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable, from, forkJoin } from 'rxjs';
import { map, startWith, flatMap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TranslateService } from '@ngx-translate/core';
import { VoteCreateComponent } from 'src/app/shared/vote-create/vote-create.component';

declare const d3: any;

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  boardId;
  stateId;
  board;
  city: any = {};
  chart;
  cities = {};
  citiesArray = [];
  statesArray = [];
  votes;
  values = [];
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  constructor(
    public route: ActivatedRoute,
    public http: HttpClient,
    public dialog: MatDialog,
    translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.boardId = params.board_id;
      this.stateId = params.state_id;
      this.getBoardData();
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value: string | any): string[] {
    const filterValue = (value.toLowerCase ? value.toLowerCase() : value.name_pt.toLowerCase());
    return this.citiesArray.filter(option => option.name_pt.toLowerCase().indexOf(filterValue) === 0);
  }

  getBoardData() {
    Utils.get(this.http, '/boards/' + this.boardId)
      .pipe(
        flatMap((board: any) => {
          this.board = board;
          return Utils.get(this.http, '/votes/' + board._id);
        })
      )
      .subscribe((votes: any) => {
        this.votes = votes;
        this.getCityData(this.stateId);
      });
  }

  getCityData(idState = this.stateId) {
    const jsonUrl = '/assets/coords/br/geo/' + idState + '.json';
    const urls = [
      `/geo/cities/${idState}`,
      '/assets/coords/br/geo/' + idState + '.json',
      `/geo/states`,
    ];

    forkJoin(
      [
        Utils.get(this.http, urls[0]),
        this.http.get(urls[1]),
        Utils.get(this.http, urls[2])
      ])
      .subscribe(([cities, data, statesArray]) => {
        this.cities = {};
        this.citiesArray = [];
        this.statesArray = statesArray;

        for (const k in cities) {
          if (!cities[k]) {
            continue;
          }
          this.cities[cities[k].originalId] = cities[k];
          this.citiesArray.push(cities[k]);
        }

        this.statesArray = this.statesArray.sort((a, b) => a.name_pt > b.name_pt ? 1 : -1);

        const votes = {};
        this.votes.forEach(v => {
          if (v.geo && this.cities[v.geo?.originalId]) {
            votes[v.geo?.originalId] = v;
          }
        });

        this.makeChart(jsonUrl, votes);
      });
  }

  makeChart(url, values) {
    d3.json(url, (error, json) => {
      const div = '#container';
      this.chart = this.drawChart(div, json, values);
    });
  }


  drawChart(div, json, values) {
    let width = 800;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      width = 350;
    }

    const height = 600;

    const vis = d3.select(div).html('').append('svg')
      .attr('width', width).attr('height', height);
    // create a first guess for the projection
    const center = d3.geo.centroid(json);
    let scale = 1;
    let offset = [width / 2, height / 2];
    let projection = d3.geo.mercator()
      .scale(scale).center(center)
      .translate(offset);

    // create the path
    let path = d3.geo.path().projection(projection);

    // using the path determine the bounds of the current map and use
    // these to determine better values for the scale and translation
    const bounds = path.bounds(json);
    const hscale = scale * width / (bounds[1][0] - bounds[0][0]);
    const vscale = scale * height / (bounds[1][1] - bounds[0][1]);
    scale = (hscale < vscale) ? hscale : vscale;
    offset = [width - (bounds[0][0] + bounds[1][0]) / 2,
    height - (bounds[0][1] + bounds[1][1]) / 2];

    // new projection
    projection = d3.geo.mercator().center(center)
      .scale(scale).translate(offset);
    path = path.projection(projection);

    // add a rectangle to see the bound of the svg
    vis.append('rect').attr('width', width).attr('height', height)
      .style('stroke', 'black').style('fill', 'none');

    const colorScale = this.makeColorpath(values);

    vis.selectAll('path').data(json.features).enter().append('path')
      .attr('d', path)
      .style('stroke-width', '1')
      .style('stroke', 'black')
      .attr('fill', (d) => {
        const id = d.properties.CD_GEOCODM;
        d.total = values[id] ? values[id].value : 0;
        // label, id, value
        return colorScale(d.total);
      });

    // mouseover or mouseout
    vis.selectAll('path').on('click', (d) => {
      const id = d.properties.CD_GEOCODM;
      const city = this.cities[id];
      this.openDialog(city);
    });

    return vis;
  }

  makeColorpath(values) {

    let max = null;
    let min = null;
    for (const key in values) {
      if (!key) {
        continue;
      }

      const v = values[key];
      if (!min) {
        min = v.value;
        max = v.value;
      } else if (min > v.value) {
        min = v.value;
      } else if (max < v.value) {
        max = v.value;
      }
    }

    let domain = [100000, 1000000, 10000000, 30000000, 100000000, 500000000];

    if (min) {
      const frac = (max - min) / 5;
      domain = [min, min + frac, min + (frac * 2), min + (frac * 3), min + (frac * 4), max];
    }
    const colorScale = d3.scaleThreshold()
      .domain(domain)
      .range(d3.schemeBlues[7]);

    return colorScale;
  }

  openDialog(city) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      city,
      board: this.board,
      boardId: this.board._id,
      update: this.getBoardData.bind(this)
    };
    const dialogRef = this.dialog.open(VoteCreateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.city = event.option.value;
    this.openDialog(this.city);
  }

  displayFn(e) {
    return e?.name_pt;
  }

  submit() {
    this.openDialog(this.city);
  }

  changeState(e) {
    this.stateId = e.value.replace(/[0-9]/g, '');
    this.getCityData(this.stateId);
  }
}
