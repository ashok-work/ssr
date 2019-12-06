import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
// import { ApisService } from '../services/apis.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataServiceService } from '../../services/data-service.service';
import { MatMenuTrigger, MatDialog, MatDialogConfig } from '@angular/material';
import { EventsType } from '../../interfaces/spaces';
import { CommonService } from '../../services/common-service/common.service';
import { GuestsDialogComponent } from './dialogs/guests-dialog.component';
import { SizeDialogComponent } from './dialogs/size-dialog.component';
import { PriceDialogComponent } from './dialogs/price-dialog.component';
import { UtilsService } from '../../services/utils/utils.service';
import { AsyncSubject, ReplaySubject } from 'rxjs';
import { MoreFiltersDialogComponent } from './dialogs/more-filters-dialog.component';
import { FavoritesDialogComponent } from '../favorites-dialog/favorites-dialog.component';
import { query } from '@angular/animations';
import { Maps } from 'src/app/services/maps/maps';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

declare var google: any;

@Component({
  selector: 'app-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class SpacesComponent implements OnInit, OnDestroy {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  //dom related 
  showPricePanel = false;
  showGuestPanel = false;
  showSizePanel = false;
  showMessage = false;
  occasionFilter: any = '';
  locationFilter: any = '';
  guestCount = 0;
  areasqfeet = 0;
  searchString: string;
  searchArea: Array<string> = [];
  searchKind: Array<string> = [];
  searchAmenity: Array<string> = [];
  searchAccessibility: Array<string> = [];
  searchSpaceRule: Array<string> = [];
  noOfFilters = 0;
  filteredSpaces: Array<any> = [];
  hourlyPrice = 50;
  dailyPrice = 30;
  filteredEvents: Array<EventsType> = [];
  filteredCities: Array<EventsType> = [];
  selectedDate = { startDate: '', endDate: '' };
  selectedDate2: Date;
  dateLabel = "";
  showMap = true;
  locations = [];
  showFullInfo = [];
  limit = 12;
  page = 0;
  showButton = true;
  loadingMore = false;
  totalSpaces = 0;
  fetchSpacesSubscription: any;
  // queryParams: any = {};
  areas: any = [];
  misc_data: any;
  popular_events = [];

  //range selector slider
  min = 0;
  max = 5000;
  rangeValues = {
    lower: this.min,
    upper: this.max
  };
  minDate = new Date();
  isFavSubscription: any;
  userPosition: any;
  lat: any;
  lng: any;
  isBrowser: any;

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if (window.innerWidth > 1015) document.getElementById('map').style.height = window.innerHeight - 57 + 'px';
    else document.getElementById('map').style.height = window.innerHeight - 57 + 'px';
    // setTimeout(() => { this.renderMap(); }, 1000);
  }

  choosedDate(event, dropdown) {
    console.log(event);
    dropdown.hide();
    this.dateLabel = event.chosenLabel;
    this.selectedDate.startDate = new Date(event.startDate._d).toISOString();
    this.selectedDate.endDate = new Date(event.endDate._d).toISOString();
    this.loadingMore = false;
    this.autoSearch();
  }

  changeMap(value) {
    this.showMap = value;
  }

  openFavoritesDialog(space_data) {
    const dialogRef = this.dialog.open(FavoritesDialogComponent, {
      width: '600px',
      panelClass: 'favorites-dialog',
      autoFocus: false,
      data: {
        space_data: space_data
      }
    });
  }

  openMoreFiltersDialog(): void {
    const dialogRef = this.dialog.open(MoreFiltersDialogComponent, {
      width: '880px',
      data: {
        misc_data: this.misc_data,
        searchAmenity: this.searchAmenity,
        searchAccessibility: this.searchAccessibility,
        searchSpaceRule: this.searchSpaceRule,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.searchAmenity = result.searchAmenity;
        this.searchAccessibility = result.searchAccessibility;
        this.searchSpaceRule = result.searchSpaceRule;
        this.checkFilters();
        this.reloadWithNewParams();
      }
    });
  }

  checkFilters() {
    this.noOfFilters = 0;
    if (this.searchAmenity.length) this.noOfFilters++;
    if (this.searchAccessibility.length) this.noOfFilters++;
    if (this.searchSpaceRule.length) this.noOfFilters++;
  }

  clearAmenities() {
    this.searchAmenity = [];
    this.checkFilters();
    this.autoSearch();
  }

  clearAccessibility() {
    this.searchAccessibility = [];
    this.checkFilters();
    this.autoSearch();
  }

  clearSpaceRules() {
    this.searchSpaceRule = [];
    this.checkFilters();
    this.autoSearch();
  }

  openGuestsDialog(): void {
    const dialogRef = this.dialog.open(GuestsDialogComponent, {
      width: '500px',
      data: {
        guestCount: this.guestCount
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result >= 0) {
        this.guestCount = result;
        this.loadingMore = false;
        this.autoSearch();
      }
    });
  }

  checkGuestCount() {
    if (this.guestCount < 0) {
      this.guestCount = 0;
    }
  }

  increaseGuests() {
    this.guestCount++;
  }

  decreaseGuests() {
    if (this.guestCount >= 1) this.guestCount--;
  }

  clearGuest(dropdown) {
    this.guestCount = 0;
    // dropdown.hide();
    // this.save(dropdown);
  }

  save(dropdown) {
    if (this.guestCount < 0) this.guestCount = 0;
    dropdown.hide();
    this.loadingMore = false;
    this.reloadWithNewParams();
  }

  openSizeDialog(): void {
    const dialogRef = this.dialog.open(SizeDialogComponent, {
      width: '300px',
      data: {
        size: this.areasqfeet
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.areasqfeet = result;
        this.loadingMore = false;
        this.autoSearch();
      }
    });
  }

  openPriceDialog(): void {
    const dialogRef = this.dialog.open(PriceDialogComponent, {
      width: '500px',
      data: {
        min: this.min,
        max: this.max,
        priceRange: this.rangeValues
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rangeValues = result;
        this.loadingMore = false;
        this.autoSearch();
      }
    });
  }

  clearPrice(dropdown) {
    this.rangeValues = {
      lower: this.min,
      upper: this.max
    };
    // dropdown.hide();
    // this.save(dropdown);
  }

  // save() {
  //   //this.guestCount = +(<HTMLInputElement>document.getElementById('guest-count')).value;
  //   this.autoSearch();
  // }

  rangeChanged(range: any) {
    console.log(range);
  }


  incrGuestCount() {
    this.guestCount += 1;
  }

  incrSizeArea() {
    this.areasqfeet += 1;
  }

  decrSizeArea() {
    if (this.areasqfeet > 0) {
      this.areasqfeet -= 1;
    }
  }

  toggleSizePanel() {
    this.showSizePanel = !this.showSizePanel;
    this.showPricePanel = false;
    this.showGuestPanel = false;
    // event.stopPropagation();
  }

  closeAllModals() {
    // this.showSizePanel = false;
    // this.showPricePanel = false;
    // this.showGuestPanel = false;

    console.log("Event Bubbling..................");

  }

  // addFilteredEvents(event: any) {
  //   let found = this.filteredEvents.some(eventItem => {
  //     return eventItem.occasion_name === event.occasion_name;
  //   });
  //   if (!found) {
  //     this.filteredEvents.push(event);
  //     this.loadingMore = false;
  //     this.autoSearch();
  //   }
  // }

  decrGuestCount() {
    if (this.guestCount > 0) {
      this.guestCount -= 1;
    }
  }
  someMethod() {
    this.trigger.openMenu();
  }

  togglePricePanel() {
    this.showPricePanel = !this.showPricePanel;
    this.showGuestPanel = false;
    this.showSizePanel = false;
    // console.log(event);

    // event.stopPropagation();
  }

  toggleGuestPanel(event: Event) {
    this.showGuestPanel = !this.showGuestPanel;
    this.showPricePanel = false;
    this.showSizePanel = false;
    // event.stopPropagation();
  }

  loadMore() {
    this.page++;
    this.loadingMore = true;
    this.autoSearch();
  }

  getNextPage(pageNumber) {
    const searchIds = this.dataService.selectedEvents.map(event => event.occasion_id);
    this.fetchSpaces(searchIds, this.dataService.selectedLocation, this.searchArea, this.searchKind, this.searchAmenity, this.searchAccessibility, this.searchSpaceRule, this.guestCount, this.rangeValues, this.selectedDate.startDate, this.selectedDate.endDate, this.limit, pageNumber);
  }

  async autoSearch() {
    const searchIds = this.dataService.selectedEvents.map(event => event.occasion_id);
    this.fetchSpaces(searchIds, this.dataService.selectedLocation, this.searchArea, this.searchKind, this.searchAmenity, this.searchAccessibility, this.searchSpaceRule, this.guestCount, this.rangeValues, this.selectedDate.startDate, this.selectedDate.endDate, this.limit, this.page);
  }

  handleArea(event, area) {
    if (event.checked) {
      this.searchArea.push(area);
    } else {
      let index = this.searchArea.indexOf(area);
      if (index != -1) this.searchArea.splice(index, 1);
    }
  }

  clearArea() {
    this.searchArea = [];
    this.searchByArea();
  }

  checkArea(area) {
    let index = this.searchArea.indexOf(area);
    return index !== -1;
  }

  handleKind(event, kind) {
    if (event.checked) {
      this.searchKind.push(kind);
    } else {
      let index = this.searchKind.indexOf(kind);
      if (index != -1) this.searchKind.splice(index, 1);
    }
  }

  clearKind() {
    this.searchKind = [];
    this.autoSearch();
  }

  checkKind(kind) {
    let index = this.searchKind.indexOf(kind);
    return index !== -1;
  }

  searchByArea() {
    const searchNames = this.dataService.selectedEvents.map(event => event.occasion_name);
    const searchIds = this.dataService.selectedEvents.map(event => event.occasion_id);
    let queryParams = {
      refresh: new Date().getTime()
    };
    if (searchNames.length) {
      queryParams['events'] = searchNames.join();
    }
    if (searchIds.length) {
      queryParams['event_ids'] = searchIds.join();
    }
    if (this.searchArea.length) {
      this.router.navigate(['spaces', this.dataService.selectedLocation, this.searchArea.join()], {
        queryParams: queryParams
      });
    } else {
      this.router.navigate(['spaces', this.dataService.selectedLocation], {
        queryParams: queryParams
      });
    }
  }

  // removeFilteredEvents(eventName) {
  //   console.log(eventName);
  //   const index = this.filteredEvents.findIndex((event) => event === eventName);
  //   if (index >= 0) {
  //     this.filteredEvents.splice(index, 1);
  //   }
  //   this.loadingMore = false;
  //   this.autoSearch();
  // }

  constructor(
    public route: ActivatedRoute
    , public router: Router
    , public commonServices: CommonService
    , public dataService: DataServiceService
    , public dialog: MatDialog
    , public utils: UtilsService
    , public maps: Maps
    , @Inject(PLATFORM_ID) public platformId: Object
  ) {
    this.commonServices.setTitle('Search Results');
    // console.log(this.dataService.filteredSpaces);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.isBrowser = isPlatformBrowser(this.platformId);

    this.isFavSubscription = this.dataService.isFavEmitter.subscribe(value => {
      let index = this.filteredSpaces.findIndex(item => { return item.space_id == value.space_id });
      this.filteredSpaces[index]['is_fav'] = value['status'];
    });

    let queryParams = this.route.queryParams['value'];
    let params = this.route.params['value'];

    if (params['placeId']) this.searchString = params['placeId'];
    else this.searchString = '';
    this.locationFilter = this.searchString;
    this.dataService.selectedLocation = this.searchString;
    this.dataService.cityEmitter.emit(true);

    if (params['area']) this.searchArea = params['area'].split(',');
    else this.searchArea = [];

    let event_ids = [];
    this.dataService.selectedEvents = [];
    if (queryParams.event_ids && queryParams.events) {
      event_ids = queryParams.event_ids.split(',');
      let events = queryParams.events.split(',');

      for (let i = 0; i < event_ids.length; i++) {
        this.dataService.selectedEvents.push({
          occasion_id: event_ids[i],
          occasion_name: events[i],
        });
      }

      this.occasionFilter = this.dataService.selectedEvents[0];
    }
    this.dataService.eventsEmitter.emit(true);

    if (queryParams.lat) {
      this.lat = queryParams.lat;
    }

    if (queryParams.lng) {
      this.lng = queryParams.lng;
    }

    if (queryParams.date) {
      this.selectedDate2 = new Date(queryParams.date);
    }

    if (queryParams.guests) {
      this.guestCount = Number.parseInt(queryParams.guests);
    }

    if (queryParams.min_price && queryParams.max_price) {
      this.rangeValues.lower = queryParams.min_price;
      this.rangeValues.upper = queryParams.max_price;
    }

    if (queryParams.amenities) {
      this.searchAmenity = queryParams.amenities.split(',');
    }

    if (queryParams.accessibility) {
      this.searchAccessibility = queryParams.accessibility.split(',');
    }

    if (queryParams.space_rules) {
      this.searchSpaceRule = queryParams.space_rules.split(',');
    }
    this.checkFilters();

    this.getMinMaxValues();

    this.getSpaceMiscData(event_ids);

    // this.route.params.subscribe((param) => {
    //   this.searchString = param['placeId'];
    //   this.dataService.selectedLocation = this.searchString;
    //   if (param['area']) this.searchArea = param['area'].split(',');
    //   else this.searchArea = [];
    // });

    // this.route.queryParams.subscribe(params => {
    //   this.queryParams = params;
    //   let event_ids;
    //   if (this.queryParams.event_ids && this.queryParams.events) {
    //     event_ids = this.queryParams.event_ids.split(',');
    //     let events = this.queryParams.events.split(',');

    //     this.dataService.selectedEvents = [];
    //     for (let i = 0; i < event_ids.length; i++) {
    //       this.dataService.selectedEvents.push({
    //         occasion_id: event_ids[i],
    //         occasion_name: events[i],
    //       });
    //     }
    //   }
    //   this.fetchSpaces(event_ids, this.dataService.selectedLocation, this.searchArea);
    // });

    // this.fetchSpacesSubscription = this.dataService.fetchSpacesEmitter.subscribe(value => {
    //   if (value) {
    //     const searchIds = this.dataService.selectedEvents.map(event => event.occasion_id);
    //     this.fetchSpaces(searchIds, this.dataService.selectedLocation, this.searchArea);
    //   }
    // });
  }

  getMinMaxValues() {
    const request = {
      action_url: '/spaces/min-max-values',
      method: 'GET',
      params: {}
    }

    this.commonServices.doHttp(request).subscribe(
      (data: any) => {
        console.log(data);
        this.min = data.min_value;
        this.max = data.max_value;
      },
      err => {
        this.commonServices.errorHandler(err);
      }
    )
  }

  getSpaceMiscData(event_ids) {
    const request = {
      params: {},
      method: 'GET',
      action_url: '/spaces/misc/info'
    };
    this.commonServices.doHttp(request).subscribe(
      data => {
        this.misc_data = data;
        this.autoSearch();
      },
      err => {
        this.commonServices.errorHandler(err);
      }
    );
  }

  async fetchSpaces(eventIds?: Array<any>, searchText?: string, searchAreas?: Array<string>, searchKind?: Array<string>, searchAmenity?: Array<string>, searchAccessibility?: Array<string>, searchSpaceRule?: Array<string>, minGuests?: any, price?: any, startDate?: string, endDate?: any, limit?: any, page: any = 0) {
    this.showMessage = false;
    // try {
    //   let result = await new Promise(function(resolve, reject) {
    //     navigator.geolocation.getCurrentPosition(resolve, reject);
    //   });
    //   this.userPosition = result;
    // } catch(err) {
    //   console.log(err);
    // }
    let spaceBody = {
      //"event_type": eventIds,
    };
    if (eventIds.length > 0) {
      spaceBody['event_type'] = eventIds;
    }
    if (searchText) {
      spaceBody["city"] = searchText;
    }
    if (searchAreas.length > 0) {
      spaceBody["area"] = searchAreas;
    }
    if (searchKind != null && searchKind.length > 0) {
      spaceBody["space_kind"] = searchKind;
    }
    if (searchAmenity != null && searchAmenity.length > 0) {
      spaceBody["amenities"] = searchAmenity;
    }
    if (searchAccessibility != null && searchAccessibility.length > 0) {
      spaceBody["accessibility"] = searchAccessibility;
    }
    if (searchSpaceRule != null && searchSpaceRule.length > 0) {
      spaceBody["space_rules"] = searchSpaceRule;
    }
    if (minGuests) {
      spaceBody["capacity"] = minGuests;
    }
    if (price) {
      spaceBody["price"] = price;
    }
    if (startDate) {
      spaceBody['start_date'] = startDate;
    }
    if (endDate) {
      spaceBody['end_date'] = endDate;
    }
    // if (this.userPosition) {
    //   spaceBody['lat'] = this.userPosition.coords.latitude;
    //   spaceBody['lng'] = this.userPosition.coords.longitude;
    // }
    if (this.lat && this.lng) {
      spaceBody['lat'] = this.lat;
      spaceBody['lng'] = this.lng;
    }
    // if (limit) {
    //   spaceBody['limit'] = limit;
    // }
    this.commonServices.presentLoading();
    const request = {
      action_url: `/spaces/list?page=${page}&limit=10`,
      method: 'POST',
      params: spaceBody
    };
    this.commonServices.doHttp(request).subscribe(
      (dataObj: Array<EventsType>) => {
        this.page = page;
        this.totalSpaces = dataObj['total_count'];
        this.areas = dataObj['areas'];
        this.popular_events = dataObj['popular_events'];
        let data = dataObj['data'];
        if (data.length <= 0) this.showButton = false;
        this.locations = [];
        for (var x in data) {
          var obj = data[x];
          if (this.loadingMore) this.filteredSpaces.push(data[x]);
          if (obj["address"] && obj["address"].lat && obj["address"].lng) {
            this.locations.push([obj["name"], obj["address"].lat, obj["address"].lng, obj["price"],
            obj["capacity"], obj['images']]);
          }
        }
        this.changeMap(true);
        this.commonServices.dismissLoading();
        if (!this.loadingMore) this.filteredSpaces = data;

        this.setAnalytics();

        this.showMessage = true;
        if (this.showMap) setTimeout(() => { this.renderMap(); }, 1000);
      },
      (err: any) => {
        this.commonServices.dismissLoading();
        console.log('Error', err);
      }
    );
    // this.commonServices.dismissLoading();

  }

  async setAnalytics() {    
    let analytics_props: any = {};
    analytics_props['occasion'] = this.dataService.selectedEvents[0].occasion_name;
    analytics_props['location'] = this.dataService.selectedLocation;
    analytics_props['searchDate'] = this.selectedDate2;
    analytics_props['result_count'] = this.filteredSpaces.length;
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
      action: "Search",
      properties: analytics_props,
    });
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

  ngOnInit() {
    // let searchIds = [];
    // if (this.queryParams.event_ids) {
    //   searchIds = this.queryParams.event_ids.split(',');
    // }
    // else if (this.dataService.selectedEvents.length) {
    //   searchIds = this.dataService.selectedEvents.map(event => event.occasion_id);
    // }
    // this.fetchSpaces(searchIds, this.dataService.selectedLocation, this.searchArea);
    this.fetchEvents();
    this.fetchLocations();
  }

  fetchEvents() {
    if (this.dataService.events.length > 0) {
      this.filteredEvents = this.dataService.events;
      return;
    }
    const request = {
      action_url: '/invite/event_type',
      method: 'GET',
      params: {}
    };
    this.commonServices.doHttp(request).subscribe((data: []) => {
      this.filteredEvents = data;
      this.dataService.events = data;
      this.dataService.eventTypesLength = data.length;
    }, (err) => {
      console.log(err);
    });
  }

  fetchLocations() {
    if (this.dataService.locations.length > 0) {
      this.filteredCities = this.dataService.locations;
      return;
    }
    const request = {
      action_url: '/spaces/cities',
      method: 'GET',
      params: {}
    };
    this.commonServices.doHttp(request).subscribe(
      (data: any) => {
        this.dataService.locations = data;
        this.filteredCities = this.dataService.locations;
      },
      (err: any) => {
        console.log('Error ', err);
      }
    );
  }

  getOccasionName(event) {
    if (event) return event.occasion_name;
    else if (this.occasionFilter) return this.occasionFilter.occasion_name;
    return '';
  }

  applyEventsFilter(filterValue: string) {
    console.log(filterValue);
    if (filterValue.length > 0) {
      console.log("looking for", filterValue);
      this.filteredEvents = this.dataService.events.filter((event: any) => event.occasion_name.toUpperCase().includes(filterValue.toUpperCase()));
    } else {
      this.filteredEvents = this.dataService.events;
    }
  }

  eventSelected(event) {
    this.dataService.selectedEvents = [event];
    this.reloadWithNewParams();
  }

  applyCityFilter(filterValue: string) {
    if (filterValue.length > 0) {
      console.log("looking for", filterValue);
      this.filteredCities = this.dataService.locations.filter((location: any) => location.city.toUpperCase().includes(filterValue.toUpperCase()));
    } else {
      this.filteredCities = this.dataService.locations;
    }
  }

  locationSelected(location) {
    this.dataService.selectedLocation = location;
    this.reloadWithNewParams();
  }

  public handleAddressChange(place: any) {
    let address = this.maps.getFormatAddress(place);
    address['lat'] = place.geometry.location.lat();
    address['lng'] = place.geometry.location.lng();
    this.setAddressFormValues(address);
    console.log('address', address);
  }

  setAddressFormValues(address: { [key: string]: any }) {
    this.dataService.selectedLocation = address['city'];
    this.locationFilter = address['city'];
    this.lat = address['lat'];
    this.lng = address['lng'];
    this.reloadWithNewParams();
  }

  reloadWithNewParams() {
    this.dataService.selectedEvents = [this.occasionFilter];
    this.dataService.selectedLocation = this.locationFilter;
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
    if (this.lat) {
      queryParams['lat'] = this.lat;
    }
    if (this.lng) {
      queryParams['lng'] = this.lng;
    }
    if (this.selectedDate2 != null) {
      queryParams['date'] = this.selectedDate2.toISOString();
    }
    if (this.guestCount > 0) {
      queryParams['guests'] = this.guestCount;
    }
    if (this.rangeValues.lower >= 0 && this.rangeValues.upper >= 0) {
      queryParams['min_price'] = this.rangeValues.lower;
      queryParams['max_price'] = this.rangeValues.upper;
    }
    if (this.searchAmenity.length) {
      queryParams['amenities'] = this.searchAmenity.join();
    }
    if (this.searchAccessibility.length) {
      queryParams['accessibility'] = this.searchAccessibility.join();
    }
    if (this.searchSpaceRule.length) {
      queryParams['space_rules'] = this.searchSpaceRule.join();
    }
    if (this.locationFilter) {
      this.router.navigate(["/spaces", this.locationFilter], {
        queryParams: queryParams
      });
    } else {
      this.router.navigate(["/spaces"], {
        queryParams: queryParams
      });
    }
  }

  ngOnDestroy(): void {
    // this.dataService.searchBroadcast.unsubscribe();
    // this.dataService.searchBroadcast = new ReplaySubject<Array<EventsType>>(0)
    // this.fetchSpacesSubscription.unsubscribe();
    this.isFavSubscription.unsubscribe();
  }

  onMenuToggle() {
    console.log("Price menu toggle is closed..");
  }

}
