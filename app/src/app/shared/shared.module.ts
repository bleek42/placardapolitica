import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardHeaderComponent } from './board-header/board-header.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LandingComponent } from './landing/landing.component';
import { HeaderComponent } from './header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { VotesComponent } from './votes/votes.component';
import { MatCardModule } from '@angular/material/card';
import { VoteCreateComponent } from './vote-create/vote-create.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LawComponent } from './law/law.component';
@NgModule({
  declarations: [BoardHeaderComponent, LandingComponent,
    HeaderComponent, VotesComponent, VoteCreateComponent, LawComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    TranslateModule,
    MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule,
    MatCardModule, MatRadioModule, MatDatepickerModule
  ],
  exports: [
    // export components
    BoardHeaderComponent,
    LandingComponent,
    HeaderComponent,
    LawComponent,

    // export modules
    HttpClientModule,
    TranslateModule,
    MatButtonModule, MatFormFieldModule,
    MatInputModule, MatCardModule,
    VotesComponent, MatSelectModule,
    MatRadioModule,
    VoteCreateComponent, MatDatepickerModule
  ],
  entryComponents: [BoardHeaderComponent, LandingComponent, HeaderComponent, LawComponent]
})
export class SharedModule { }
