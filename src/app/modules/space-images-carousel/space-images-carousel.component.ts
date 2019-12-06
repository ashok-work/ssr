import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-space-images-carousel',
  templateUrl: './space-images-carousel.component.html',
  styleUrls: ['./space-images-carousel.component.scss']
})
export class SpaceImagesCarouselComponent implements OnInit {
  @Input() images: Array<any>;
  @Input() space_id: any;

  constructor(
    public router: Router,
  ) { }

  ngOnInit() {
    if (!this.images) this.images = [];
  }

  showDetails() {
    this.router.navigate(['/details', this.space_id]);
  }

}
