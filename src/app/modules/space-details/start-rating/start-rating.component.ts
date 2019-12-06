import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-start-rating',
  templateUrl: './start-rating.component.html',
  styleUrls: ['./start-rating.component.scss']
})
export class StartRatingComponent implements OnInit {
  starTypes = ["bordered", "bordered", "bordered", "bordered", "bordered",];
  rating: number;
  @Input('rating') set assignrating(rating: any) {
    console.log(rating);
    this.rating = Number(rating);
    let avgRating = Math.floor(this.rating);
    for (let index = 0; index < avgRating; index++) {
      this.starTypes[index] = "full";
    }
    if (this.rating != avgRating) {
      this.starTypes[avgRating] = "half";
    }
  }
  constructor() {

  }

  ngOnInit() {

  }

}
