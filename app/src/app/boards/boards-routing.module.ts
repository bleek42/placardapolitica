import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateBoardComponent } from './create-board/create-board.component';
import { ListBoardComponent } from './list-board/list-board.component';
import { ShowBoardComponent } from './show-board/show-board.component';

const routes: Routes = [
  { path: 'boards/create', component: CreateBoardComponent },
  { path: 'boards', component: ListBoardComponent },
  { path: 'boards/:board_id', component: ShowBoardComponent },
  { path: 'boards/:type/:board_id', component: ShowBoardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class BoardsRoutingModule { }
