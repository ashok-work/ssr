import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingMenuComponent } from './booking-menu.component';

describe('BookingMenuComponent', () => {
  let component: BookingMenuComponent;
  let fixture: ComponentFixture<BookingMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
