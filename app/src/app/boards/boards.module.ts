import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateBoardComponent } from './create-board/create-board.component';
import { ListBoardComponent } from './list-board/list-board.component';
import { ShowBoardComponent } from './show-board/show-board.component';
import { BoardsRoutingModule } from './boards-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { PoliticComponent } from './politic/politic.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PoliticBoardComponent } from './politic-board/politic-board.component';
import { SharedModule } from '../shared/shared.module';
import { ItemBoardComponent } from './item-board/item-board.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsersModule } from '../users/users.module';
@NgModule({
  declarations: [
    CreateBoardComponent,
    ListBoardComponent,
    ShowBoardComponent,
    PoliticComponent,
    PoliticBoardComponent,
    ItemBoardComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatInputModule, MatFormFieldModule, MatListModule, MatCheckboxModule,
    MatButtonModule, MatAutocompleteModule,
    BoardsRoutingModule,
    MatIconModule,
    SharedModule,
    MatTooltipModule,
    UsersModule,
    TranslateModule

  ],
  entryComponents: [PoliticComponent, ItemBoardComponent]
})
export class BoardsModule { }
