import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceImagesCarouselComponent } from './space-images-carousel.component';

describe('SpaceImagesCarouselComponent', () => {
  let component: SpaceImagesCarouselComponent;
  let fixture: ComponentFixture<SpaceImagesCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceImagesCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceImagesCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
