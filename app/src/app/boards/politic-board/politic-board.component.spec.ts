import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticBoardComponent } from './politic-board.component';

describe('PoliticBoardComponent', () => {
  let component: PoliticBoardComponent;
  let fixture: ComponentFixture<PoliticBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoliticBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliticBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
