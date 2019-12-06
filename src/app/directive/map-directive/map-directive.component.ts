import { Component, OnInit, Input, ElementRef, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { google } from 'google-maps';
@Component({
  selector: 'app-map',
  template: '<div id="map"></div>',
  styles: [`
    #map {
      height: 20vw;
      min-height: 220px;
    }
  `]
})
export class MapComponent implements OnInit, OnChanges {
  @Input('lat') lat: number;
  @Input('lng') lng: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.renderMap(this.lat, this.lng);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.renderMap(changes.lat.currentValue, changes.lng.currentValue);
  }

  renderMap(lat, lng) {
    let latlng = new google.maps.LatLng(lat, lng);
    let map = new google.maps.Map(document.getElementById('map'), {
      center: latlng,
      backgroundColor: "pink",
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    let marker = new google.maps.Marker({ position: latlng, map: map });
  }

}
