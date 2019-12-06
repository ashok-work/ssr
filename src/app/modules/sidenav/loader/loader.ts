import {AfterViewInit, Component, Input} from '@angular/core';
/**
 * Generated class for the LoaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'loader',
  templateUrl: 'loader.html',
  styleUrls: ['./loader.scss'],
})
export class LoaderComponent implements AfterViewInit {

  constructor() {
    console.log('Hello LoaderComponent Component');
  }

  ngAfterViewInit() {

  }

}
