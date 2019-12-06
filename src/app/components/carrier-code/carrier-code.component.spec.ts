import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierCodeComponent } from './carrier-code.component';

describe('CarrierCodeComponent', () => {
  let component: CarrierCodeComponent;
  let fixture: ComponentFixture<CarrierCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
