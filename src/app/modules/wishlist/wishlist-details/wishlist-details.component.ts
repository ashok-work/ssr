import { Component, OnInit, HostListener } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DeleteSpaceDialogComponent } from '../dialogs/delete-space-dialog.component';

declare var google: any;

@Component({
  selector: 'app-wishlist-details',
  templateUrl: './wishlist-details.component.html',
  styleUrls: ['./wishlist-details.component.scss']
})
export class WishlistDetailsComponent implements OnInit {

  wishlist_id: any;
  wishlist_name: any;
  spaces: any = [];
  totalSpaces: any = 0;
  page: any = 0;
  locations = [];
  showFullInfo = [];

  constructor(
    public commonServices: CommonService,
    public route: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((param) => {
      if (param['wishlist_id'] && param['wishlist_name']) {
        this.wishlist_id = param['wishlist_id'];
        this.wishlist_name = param['wishlist_name'].replace(/-/g, ' ');
        this.getSpaces(0);
      } else {
        this.router.navigate(['/saved']);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if (window.innerWidth > 1015) document.getElementById('map').style.height = window.innerHeight - 57 + 'px';
    else document.getElementById('map').style.height = window.innerHeight - 57 + 'px';
    // setTimeout(() => { this.renderMap(); }, 1000);
  }

  getSpaces(pageNumber) {
    this.page = pageNumber;
    const request = {
      action_url: '/spaces/listing/' + this.wishlist_id,
      method: 'GET',
      params: {
        page: pageNumber,
        limit: 10,
      }
    };

    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe((data: any) => {
      this.commonServices.dismissLoading();
      this.spaces = data['data'];
      this.totalSpaces = data['total_count'];
      this.locations = [];
      for (let x in this.spaces) {
        let obj = this.spaces[x];
        if (obj["address"] && obj["address"].lat && obj["address"].lng) {
          this.locations.push([obj["name"], obj["address"].lat, obj["address"].lng, obj["price"],
          obj["capacity"], obj['images']]);
        }
      }
      setTimeout(() => { this.renderMap(); }, 1000);
    }, (error) => {
      this.commonServices.dismissLoading();
      this.commonServices.errorHandler(error);
    })
  }

  renderMap() {
    let map_canvas = document.getElementById('map');

    var map = new google.maps.Map(map_canvas, {
      zoom: 10,
      maxZoom: 14,
      center: this.locations.length > 0 ? new google.maps.LatLng(this.locations[0][1], this.locations[0][2]) : new google.maps.LatLng(17.38405, 78.45636),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    map_canvas.style.height = window.innerHeight - 57 + 'px';

    var infowindow = new google.maps.InfoWindow();

    var i, popup, Popup;

    Popup = this.createPopupClass();

    for (i = 0; i < this.locations.length; i++) {

      this.showFullInfo.push(false);
      popup = new Popup(
        new google.maps.LatLng(
          this.locations[i][1], this.locations[i][2]), document.getElementById(i),
        document.getElementById('anchor' + i), document.getElementById('parent' + i)
      )
      popup.setMap(map);
    }
  }

  createPopupClass() {
    function Popup(position, content, anchor, parent) {
      this.position = position;

      content.classList.add('popup-bubble');

      var bubbleAnchor = anchor;
      bubbleAnchor.classList.add('popup-bubble-anchor');
      bubbleAnchor.appendChild(content);

      this.containerDiv = parent;
      this.containerDiv.classList.add('popup-container');
      this.containerDiv.appendChild(bubbleAnchor);

      google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.containerDiv);
    }

    Popup.prototype = new google.maps.OverlayView();

    Popup.prototype.onAdd = function () {
      this.getPanes().floatPane.appendChild(this.containerDiv);
    }

    Popup.prototype.onRemove = function () {
      // if (this.containerDiv.parentElement) {
      //   this.containerDiv.parentElement.removeChild(this.containerDiv);
      // }
    }

    Popup.prototype.draw = function () {
      var divPosition = this.getProjection().fromLatLngToDivPixel(this.position);

      var display = Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ? 'block' : 'none';

      if (display == 'block') {
        this.containerDiv.style.left = divPosition.x + 'px';
        this.containerDiv.style.top = divPosition.y + 'px';
      }

      if (this.containerDiv.style.display !== display) {
        this.containerDiv.style.display = display;
      }
    }

    return Popup;
  }

  openDeleteSpaceDialog(space_id, index) {
    const dialogRef = this.dialog.open(DeleteSpaceDialogComponent, {
      width: '400px',
      panelClass: 'delete-space-dialog',
      backdropClass: 'custom-dialog',
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteSpaceFromList(space_id, index);
      }
    })
  }

  deleteSpaceFromList(space_id, index) {
    const request = {
      action_url: '/spaces/listing/space',
      method: 'PUT',
      params: {
        'space_id': space_id,
        'listing_id': this.wishlist_id
      }
    };

    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe((data: any) => {
      this.commonServices.dismissLoading();
      this.spaces.splice(index, 1);
      this.commonServices.notification(data['msg']);
    }, (error) => {
      this.commonServices.dismissLoading();
      this.commonServices.errorHandler(error);
    });
  }

  navigate(space_id) {
    window.open('details/' + space_id, '_blank');
  }
}
