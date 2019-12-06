import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutPreferencesComponent } from './payout-preferences.component';

describe('PayoutPreferencesComponent', () => {
  let component: PayoutPreferencesComponent;
  let fixture: ComponentFixture<PayoutPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayoutPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
