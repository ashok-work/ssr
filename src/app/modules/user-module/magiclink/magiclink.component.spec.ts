import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MagiclinkComponent } from './magiclink.component';

describe('HeaderComponent', () => {
  let component: MagiclinkComponent;
  let fixture: ComponentFixture<MagiclinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagiclinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagiclinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
