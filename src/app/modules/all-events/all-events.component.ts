import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['../homepage/homepage.component.scss', './all-events.component.scss']
})
export class AllEventsComponent implements OnInit {
  events = [];
  eventGroups = [];

  constructor(
    public commonServices: CommonService,
    public dataService: DataServiceService,
    public router: Router
  ) {
    this.commonServices.setTitle('All Events');
  }

  // async submitSearch(event: any) {
  //   if (event) {
  //     this.dataService.searchBroadcast.next([event]);
  //     this.router.navigate(["/spaces"]);
  //   }
  // }

  submitSearch(event) {
    this.dataService.selectedEvents = [event];
    const searchNames = this.dataService.selectedEvents.map(event => event.occasion_name);
    const searchIds = this.dataService.selectedEvents.map(event => event.occasion_id);
    let queryParams = {
      refresh: new Date().getTime()
    };
    if (searchNames.length) {
      queryParams['events'] = searchNames.join()
    }
    if (searchIds.length) {
      queryParams['event_ids'] = searchIds.join()
    }
    this.router.navigate(["/spaces"], {
      queryParams: queryParams
    });
  }

  ngOnInit() {
    // this.fetchSpaces();
    this.fetchGroupedEvents();
  }

  fetchGroupedEvents() {
    const request = {
      action_url: '/spaces/activities_group',
      method: 'GET',
      params: {}
    }

    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe(
      (data: any) => {
        console.log(data);
        this.eventGroups = data;
        this.commonServices.dismissLoading();
      },
      err => {
        this.commonServices.errorHandler(err);
        this.commonServices.dismissLoading();
      }
    );
  }

  fetchSpaces() {
    const request = {
      action_url: '/invite/event_type',
      method: 'GET',
      params: {}
    };
    this.commonServices.doHttp(request).subscribe((data: []) => {
      this.events = data;
      this.commonServices.dismissLoading();
    }, (err) => {
      console.log(err);
      this.commonServices.dismissLoading();
    });
  }

}
