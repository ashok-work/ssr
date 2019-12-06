import { Component, OnInit, Inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from "@angular/forms";
import { Observable, AsyncSubject } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CommonService } from "../../services/common-service/common.service";
import { Router } from "@angular/router";
import { DataServiceService } from "../../services/data-service.service";
import { UtilsService } from "src/app/services/utils/utils.service";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"]
})
export class HomepageComponent implements OnInit {
  upcomingEvents = [];
  homepageEvents = [];

  searchForm: FormGroup;

  constructor(
    public commonServices: CommonService,
    public dataService: DataServiceService,
    public utils: UtilsService,
    public router: Router,
    public fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      selectedEvent: [null, Validators.required],
      selectedLocation: [null],
      selectedDate: [null]
    });
    this.commonServices.setTitle("EventoLoop");
  }

  ngOnInit() {
    this.fetchHomepageEvents();
    this.fetchUpcomingEvents();
    //this.dataService.searchBroadcast = new AsyncSubject();
  }

  fetchHomepageEvents() {
    const request = {
      action_url: "/invite/event_type?type=home",
      method: "GET",
      params: {}
    };

    this.commonServices.doHttp(request).subscribe(
      (data: any) => {
        this.homepageEvents = data;
      },
      err => {
        this.commonServices.errorHandler(err);
      }
    );
  }

  async fetchUpcomingEvents() {
    try {
      const result = await this.utils.initApp();
      if (result) {
        const request = {
          action_url: "/invite?page=0&limit=3&selection=upcoming",
          method: "GET",
          params: {}
        };
        this.commonServices.doHttp(request).subscribe(
          (data: any) => {
            this.upcomingEvents = data;
          },
          err => {
            this.commonServices.errorHandler(err);
          }
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  viewAllEvents() {
    this.router.navigate(["/all-events"]);
  }

  navigateToInvites(path, param) {
    if (param) {
      window.open(
        this.commonServices.info["invites_url"] + path + "/" + param,
        "_blank"
      );
    } else {
      window.open(this.commonServices.info["invites_url"] + path, "_blank");
    }
  }

  selectOccasion(event) {
    this.searchForm.patchValue({
      selectedEvent: event
    });
    this.submitSearch();
  }

  submitSearch() {
    if (this.searchForm.valid) {
      console.log(this.searchForm.value);
      this.dataService.selectedEvents = [this.searchForm.value.selectedEvent];
      this.dataService.selectedLocation = this.searchForm.value.selectedLocation;
      const searchNames = this.dataService.selectedEvents.map(
        event => event.occasion_name
      );
      const searchIds = this.dataService.selectedEvents.map(
        event => event.occasion_id
      );
      let queryParams = {
        refresh: new Date().getTime()
      };
      if (searchNames.length) {
        queryParams["events"] = searchNames.join();
      }
      if (searchIds.length) {
        queryParams["event_ids"] = searchIds.join();
      }
      if (this.searchForm.value.selectedLocation) {
        this.router.navigate(
          ["/spaces", this.searchForm.value.selectedLocation],
          {
            queryParams: queryParams
          }
        );
      } else {
        this.router.navigate(["/spaces"], {
          queryParams: queryParams
        });
      }
    }
  }
}
