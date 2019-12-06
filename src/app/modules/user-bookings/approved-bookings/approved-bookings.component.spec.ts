import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedBookingsComponent } from './approved-bookings.component';

describe('ApprovedBookingsComponent', () => {
  let component: ApprovedBookingsComponent;
  let fixture: ComponentFixture<ApprovedBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
