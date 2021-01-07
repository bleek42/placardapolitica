import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticComponent } from './politic.component';

describe('PoliticComponent', () => {
  let component: PoliticComponent;
  let fixture: ComponentFixture<PoliticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoliticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
