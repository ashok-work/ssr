import { Component, OnInit, Input, ViewChild, EventEmitter, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CoverPhotosDialogComponent } from './cover-photos-dialog.component';
import { FavoritesDialogComponent } from '../../favorites-dialog/favorites-dialog.component';
import { DataServiceService } from 'src/app/services/data-service.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-cover-photos',
  templateUrl: './cover-photos.component.html',
  styleUrls: ['./cover-photos.component.scss']
})
export class CoverPhotosComponent implements OnInit, OnDestroy {
  @Input() photos: Array<Object>;
  @Input() space_data: any;
  isFavSubscription: any;

  defaultImage = {
    Location: "assets/images/default_space.jpg",
    Key: "Default Image"
  };

  constructor(
    public commonServices: CommonService,
    public dataService: DataServiceService,
    public dialog: MatDialog,
    public utils: UtilsService,
  ) {
    this.isFavSubscription = this.dataService.isFavEmitter.subscribe(value => {
      this.space_data['is_fav'] = value['status'];
    });
  }

  openFavoritesDialog() {
    const dialogRef = this.dialog.open(FavoritesDialogComponent, {
      width: '600px',
      panelClass: 'favorites-dialog',
      data: {
        space_data: this.space_data
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CoverPhotosDialogComponent, {
      width: '80vw',
      data: this.photos,
      panelClass: 'cover-photos-dialog',
      backdropClass: 'darker-backdrop'
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    })
  }

  async setAnalytic(method) {
    let analytics_props: any = {};
    analytics_props['spaceId'] = this.space_data.spaceId;
    analytics_props['method'] = method;
    try {
      const result = await this.utils.initApp();
      if (result) {
        const userProfile = this.utils.user;
        if(userProfile && userProfile.user_id) {
          analytics_props['userIdentifier'] = userProfile.user_id;
        } else {
          analytics_props['userIdentifier'] = "Anonymous";
        }
      }
    } catch(err) {
      analytics_props['userIdentifier'] = "Anonymous";
      console.log(err);
    }

    this.commonServices.addAnalytic({
      action: "SpaceDetailView",
      properties: analytics_props,
    });
  }

  ngOnInit() {
    if (!this.photos) this.photos = [];
    let size = this.photos.length;
    for (var i = 0; i < 5 - size; i++) {
      this.photos.push(this.defaultImage);
    }
  }

  ngOnDestroy() {
    this.isFavSubscription.unsubscribe();
  }
}
