import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingDataService } from 'src/app/services/booking/booking-data.service';
import { MatDialog } from '@angular/material';
import { PackageDialogComponent } from './dialogs/package-dialog.component';
import { ItemDialogComponent } from './dialogs/item-dialog.component';

@Component({
  selector: 'app-booking-menu',
  templateUrl: './booking-menu.component.html',
  styleUrls: ['./booking-menu.component.scss']
})
export class BookingMenuComponent implements OnInit {

  space_id: any;
  space_name: any;
  categories: any = [];
  catering_packages: any = [];
  cart: any = [];
  total_price: number = 0;
  discount: number = 0;
  total_price_after_discount: number = 0;

  constructor(
    public commonServices: CommonService,
    public route: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    public bookingService: BookingDataService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((param) => {
      if (param['space_id'] && param['space_name']) {
        if (this.bookingService.currentBookingInfo == null) {
          this.navigateAway();
        }

        this.space_id = param['space_id'];
        this.space_name = param['space_name'].replace(/-/g, ' ');

        if (this.bookingService.currentBookingInfo.cart_added) {
          this.bookingService.currentBookingInfo = null;
          this.navigateAway();
        }
        this.getMenu();
      }
      else {
        this.navigateAway();
      }
    });
  }

  navigateAway() {
    if (this.space_id) this.router.navigate(['details/' + this.space_id]);
    else this.router.navigate(['']);
  }

  getMenu() {
    const request = {
      action_url: '/catering/menu/' + this.space_id,
      method: 'GET',
      params: {},
    }

    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe(
      data => {
        this.commonServices.dismissLoading();
        console.log(data);
        this.categories = data['categories'];
        this.catering_packages = data['catering_packages'];
      },
      err => {
        this.commonServices.dismissLoading();
        this.commonServices.errorHandler(err);
      }
    )
  }

  openPackageDialog(packageObj) {
    const dialogRef = this.dialog.open(PackageDialogComponent, {
      width: '600px',
      panelClass: 'package-dialog',
      backdropClass: 'custom-dialog',
      data: {
        package: packageObj,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addToCart(packageObj, result, true);
      }
    })
  }

  openItemDialog(itemObj) {
    const dialogRef = this.dialog.open(ItemDialogComponent, {
      width: '600px',
      panelClass: 'item-dialog',
      backdropClass: 'custom-dialog',
      data: {
        item: itemObj,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addToCart(itemObj, result, false);
      }
    })
  }

  addToCart(itemObj, bookedItems, isPackage) {
    let items = [];
    if (this.bookingService.spaceBookingDetails.allow_multiple_catering_packages) {
      if (itemObj.item_id) {
        items = this.cart.filter(item => item.item.item_id == itemObj.item_id);
      } else {
        items = this.cart.filter(item => item.item.category_id == itemObj.category_id);
      }
    } else {
      if (itemObj.item_id) {
        items = this.cart.filter(item => item.item.item_id == itemObj.item_id);
      } else {
        items = this.cart.filter(item => item.isPackage);
      }
    }
    if (!items.length) {
      this.cart.push({
        item: itemObj,
        price: bookedItems.price,
        quantity: bookedItems.quantity,
        selection: bookedItems.selection,
        isPackage: isPackage,
      });
      this.total_price = this.total_price + Number.parseInt(bookedItems.price);
      this.discount = (this.bookingService.spaceBookingDetails.discount / 100.0) * (this.total_price);
      this.total_price_after_discount = this.total_price - this.discount;
    } else {
      this.total_price = this.total_price + Number.parseInt(bookedItems.price) - Number.parseInt(items[0].price);
      this.discount = (this.bookingService.spaceBookingDetails.discount / 100.0) * (this.total_price);
      this.total_price_after_discount = this.total_price - this.discount;
      items[0].item = itemObj;
      items[0].price = bookedItems.price;
      items[0].quantity = bookedItems.quantity;
      items[0].selection = bookedItems.selection;
      items[0].isPackage = isPackage;
    }
  }

  removeFromCart(index) {
    this.cart.splice(index, 1);
  }

  submit() {
    console.log(this.cart);
    this.bookingService.currentBookingInfo.cart = this.cart;
    this.bookingService.currentBookingInfo.cart_total = this.total_price;
    this.bookingService.currentBookingInfo.cart_discount = this.discount;
    this.bookingService.currentBookingInfo.cart_total_after_discount = this.total_price_after_discount;
    this.router.navigate(["/booking-preview"]);
  }
}
