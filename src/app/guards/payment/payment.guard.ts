import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BookingDataService } from 'src/app/services/booking/booking-data.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentGuard implements CanActivate {
  constructor(public bookingDataService: BookingDataService, public router: Router) {

  }

  canActivate(): boolean {
    if (!this.bookingDataService.currentBookingInfo) {
      this.router.navigate(['/'], { replaceUrl: true });
      return false;
    }
    return true;
  }
}
