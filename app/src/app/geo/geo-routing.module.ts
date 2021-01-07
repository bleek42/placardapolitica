import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatesComponent } from './states/states.component';
import { CitiesComponent } from './cities/cities.component';

const routes: Routes = [
  { path: 'geo/state/:board_id', component: StatesComponent },
  { path: 'geo/city/:board_id/:state_id', component: CitiesComponent },
  // { path: 'geo/datacity/:board_id/:city_id', component: VoteCreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class GeoRoutingModule { }
