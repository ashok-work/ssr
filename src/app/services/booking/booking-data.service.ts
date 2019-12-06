import { Injectable } from '@angular/core';
import { SpaceType, BookingInfo } from 'src/app/interfaces/spaces';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingDataService {
  currentBookingInfo: BookingInfo;
  spaceBookingDetails: SpaceType;
  spaceId: ReplaySubject<string> = new ReplaySubject(1);
  constructor() { }
}
