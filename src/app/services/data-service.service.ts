import { Injectable, EventEmitter } from '@angular/core';
import { EventsType } from '../interfaces/spaces';
import { FormControl } from '@angular/forms';
import { Subject, ReplaySubject, AsyncSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  events: Array<EventsType> = [];
  locations: any = [];
  selectedLocation: string = "";
  //used by search bar
  searchBroadcast = new ReplaySubject<Array<EventsType>>(1);
  selectedEvents: any = [];
  cityEmitter = new EventEmitter<boolean>();
  eventsEmitter = new EventEmitter<boolean>();
  isFavEmitter = new EventEmitter<any>();
  eventTypesLength: any;
  constructor() { }
}
