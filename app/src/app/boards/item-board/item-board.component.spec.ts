import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemBoardComponent } from './item-board.component';

describe('ItemBoardComponent', () => {
  let component: ItemBoardComponent;
  let fixture: ComponentFixture<ItemBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
