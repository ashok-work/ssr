import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastBookingsComponent } from './past-bookings.component';

describe('PastBookingsComponent', () => {
  let component: PastBookingsComponent;
  let fixture: ComponentFixture<PastBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
