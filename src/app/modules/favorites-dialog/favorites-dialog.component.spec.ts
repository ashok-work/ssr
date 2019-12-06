import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesDialogComponent } from './favorites-dialog.component';

describe('FavoritesDialogComponent', () => {
  let component: FavoritesDialogComponent;
  let fixture: ComponentFixture<FavoritesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoritesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
