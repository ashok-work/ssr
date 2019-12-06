import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySpacesComponent } from './my-spaces.component';

describe('MySpacesComponent', () => {
  let component: MySpacesComponent;
  let fixture: ComponentFixture<MySpacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySpacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySpacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
