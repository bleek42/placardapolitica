import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { startWith, map, flatMap } from 'rxjs/operators';
import Utils from 'src/app/utils';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { VoteCreateComponent } from 'src/app/shared/vote-create/vote-create.component';

declare const d3: any;
// declare const topojson: any;
@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss']
})
export class StatesComponent implements OnInit {
  boardId;
  board;
  chart;
  votes;
  states: any = {};
  statesArray: any = [];
  values = [];

  constructor(
    public route: ActivatedRoute,
    public http: HttpClient,
    public dialog: MatDialog,
    translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.boardId = params.board_id;
      this.getBoardData();
    });

  }



  getBoardData() {
    Utils.get(this.http, '/boards/' + this.boardId)
      .pipe(
        flatMap((board: any) => {
          this.board = board;
          return Utils.get(this.http, '/votes/' + board._id + '?type=state');
        })
      )
      .subscribe((votes: any) => {
        this.votes = votes;
        this.getCityData();
      });
  }

  getCityData() {
    const json = '/assets/coords/br/geo/states.json';
    const urls = [
      '/geo/states',
    ];

    forkJoin(urls.map(url => Utils.get(this.http, url)))
      .subscribe(([data]) => {

        // Preparing data to make the geo chart
        this.states = {};
        this.statesArray = data;
        data.forEach(d => {
          this.states[d.coordId] = d;
        });

        const votes = {};
        this.votes
          .filter(v => v.status === 'accepted')
          .forEach(v => {
            if (v.geo) {
              votes[v.geo?.coordId] = v;
            }
          });

        this.makeChart(json, votes);
      });
  }


  makeChart(url, values) {
    // https://developer.aliyun.com/mirror/npm/package/d3plus-geomap
    if (!this.chart) {
      const div = '#container';
      d3.json(url, (error, json) => {
        this.drawChart(div, json, values);
      });
    }
  }


  drawChart(div, json, values) {
    let width = 800;
    const height = 600;

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      width = 350;
    }
    const vis = d3.select(div).html('').append('svg')
      .attr('width', width).attr('height', height);
    // create a first guess for the projection
    let center = d3.geo.centroid(json);
    center = [
      center[0],
      center[1] - 4
    ]
    let scale = 10;
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
        const id = d.id;
        d.total = values[id] ? values[id].value : 0;
        // label, id, value
        return colorScale(d.total);
      });

    // mouseover or mouseout
    vis.selectAll('path').on('click', (d) => {
      const id = d.id;
      const state = this.states[id];
      this.openDialog(state);
    });

    return vis;
  }


  makeColorpath(values, prop = 'value') {

    let max = null;
    let min = null;
    for (const key in values) {
      if (!key) {
        continue;
      }

      const v = values[key];
      if (!min) {
        min = v[prop];
        max = v[prop];
      } else if (min > v[prop]) {
        min = v[prop];
      } else if (max < v[prop]) {
        max = v[prop];
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


  openDialog(state) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      city: state,
      board: this.board,
      update: this.getBoardData.bind(this),
      type: 'state'
    };

    const dialogRef = this.dialog.open(VoteCreateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
