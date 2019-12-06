import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  @Input() space_id: string;
  lists: Array<Object>;
  listName: string = "";

  constructor(
    public commonServices: CommonService,
    public dataService: DataServiceService,
    public utils: UtilsService,
  ) { }

  ngOnInit() {
    this.getLists();
  }

  getLists() {
    const request = {
      action_url: '/spaces/listing',
      method: 'GET',
      params: {}
    };
    this.commonServices.doHttp(request).subscribe((data: any) => {
      this.lists = data['data'];
    });
  }

  addList() {
    const request = {
      action_url: '/spaces/listing',
      method: 'POST',
      params: {
        'listing_name': this.listName
      }
    };
    this.commonServices.doHttp(request).subscribe((data: any) => {
      this.lists.push({
        'listing_id': data.listing_id,
        'listing_name': this.listName,
        'spaces': null,
      })
      this.listName = '';
      this.saveToList(data.listing_id, this.lists.length-1);
      // this.commonServices.notification(data['msg']);
    }, (error) => {
      this.commonServices.errorHandler(error);
    });
  }

  saveToList(listing_id, index) {
    const request = {
      action_url: '/spaces/listing/space',
      method: 'POST',
      params: {
        'space_id': this.space_id,
        'listing_id': listing_id
      }
    };
    this.commonServices.doHttp(request).subscribe((data: any) => {
      if (this.lists[index]['spaces'] == null)
        this.lists[index]['spaces'] = [this.space_id];
      else
        this.lists[index]['spaces'].push(this.space_id);
      // this.commonServices.notification(data['msg']);
      this.setSavedAnalytics();
      this.dataService.isFavEmitter.emit({ space_id: this.space_id, status: true });
    }, (error) => {
      this.commonServices.errorHandler(error);
    });
  }

  async setSavedAnalytics() {
    let analytics_props: any = {};
    analytics_props['spaceId'] = this.space_id;
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
      action: "AddToFavorites",
      properties: analytics_props,
    });
  }

  removeFromList(listing_id, index) {
    const request = {
      action_url: '/spaces/listing/space',
      method: 'PUT',
      params: {
        'space_id': this.space_id,
        'listing_id': listing_id
      }
    };
    this.commonServices.doHttp(request).subscribe((data: any) => {
      let pos = this.lists[index]['spaces'].indexOf(this.space_id);
      if (pos !== -1) this.lists[index]['spaces'].splice(pos, 1);
      let is_fav = false;
      this.lists.forEach(list => {
        if (list['spaces'].indexOf(this.space_id) != -1) is_fav = true;
      });
      this.setRemovedAnalytics();
      this.dataService.isFavEmitter.emit({ space_id: this.space_id, status: is_fav });
      // this.commonServices.notification(data['msg']);
    }, (error) => {
      this.commonServices.errorHandler(error);
    });
  }

  async setRemovedAnalytics() {
    let analytics_props: any = {};
    analytics_props['spaceId'] = this.space_id;
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
      action: "RemoveFromFavorites",
      properties: analytics_props,
    });
  }

}
