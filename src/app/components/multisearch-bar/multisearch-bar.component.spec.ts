import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultisearchBarComponent } from './multisearch-bar.component';

describe('MultisearchBarComponent', () => {
  let component: MultisearchBarComponent;
  let fixture: ComponentFixture<MultisearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultisearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultisearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
