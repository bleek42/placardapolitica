import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitiesComponent } from './cities/cities.component';
import { StatesComponent } from './states/states.component';
import { GeoRoutingModule } from './geo-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from '../shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [CitiesComponent, StatesComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatInputModule, MatFormFieldModule, MatListModule, MatCheckboxModule,
    MatButtonModule, MatSelectModule,
    MatAutocompleteModule, MatCardModule,
    GeoRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class GeoModule { }
