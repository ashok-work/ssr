import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common-service/common.service';
import { MatDialog } from '@angular/material';
import { WishlistDialogComponent } from './wishlist-dialog.component';
import { EditWishlistDialogComponent } from './dialogs/edit-wishlist-dialog.component';
import { DeleteWishlistDialogComponent } from './dialogs/delete-wishlist-dialog.component';
import { Router } from '@angular/router';
import { AddWishlistDialogComponent } from './dialogs/add-wishlist-dialog.component';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  totalWishlists: any;
  wishlists: Array<Object> = [];
  listName: string = "";
  editing = {};
  newName: string = "";
  page = 0;

  constructor(
    public commonServices: CommonService,
    public router: Router,
    public dialog: MatDialog
  ) {
    this.commonServices.setTitle('Favorites');
  }

  navigateToDetails(wishlist) {
    let wishlist_name = wishlist.listing_name.replace(/\s+/g, '-');
    let url = '/saved/' + wishlist.listing_id + '/' + wishlist_name;
    this.router.navigate([url]);
  }

  openDialog(wishlist, index): void {
    const dialogRef = this.dialog.open(WishlistDialogComponent, {
      disableClose: true,
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      data: wishlist,
      panelClass: 'wishlist-dialog',
      backdropClass: 'custom-backdrop'
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.wishlists[index] = result;
    })
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddWishlistDialogComponent, {
      width: '400px',
      panelClass: 'add-wishlist-dialog',
      backdropClass: 'custom-dialog',
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result && result != '') this.addList(result);
    })
  }

  openEditDialog(wishlist, index): void {
    const dialogRef = this.dialog.open(EditWishlistDialogComponent, {
      width: '400px',
      data: wishlist,
      panelClass: 'edit-wishlist-dialog',
      backdropClass: 'custom-dialog',
    })

    dialogRef.afterClosed().subscribe(result => {
      this.wishlists[index] = result;
    })
  }

  openDeleteDialog(wishlist_id, index): void {
    const dialogRef = this.dialog.open(DeleteWishlistDialogComponent, {
      width: '400px',
      panelClass: 'delete-wishlist-dialog',
      backdropClass: 'custom-dialog',
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteList(wishlist_id, index);
      }
    })
  }

  addList(wishlist_name) {
    const request = {
      action_url: '/spaces/listing',
      method: 'POST',
      params: {
        'listing_name': wishlist_name
      }
    };

    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe((data: any) => {
      this.commonServices.dismissLoading();
      this.wishlists.push({
        'listing_id': data.listing_id,
        'listing_name': wishlist_name,
        'spaces': null,
      });
      this.totalWishlists++;
      this.commonServices.notification(data['msg']);
    }, (error) => {
      this.commonServices.dismissLoading();
      this.commonServices.errorHandler(error);
    });
  }

  // editList(listing_id, index) {
  //   const request = {
  //     action_url: '/spaces/listing',
  //     method: 'PUT',
  //     params: {
  //       listing_name: this.newName,
  //       listing_id: listing_id
  //     }
  //   }
  //   this.commonServices.doHttp(request).subscribe((data: any) => {
  //     this.wishlists[index]['listing_name'] = this.newName;
  //     this.newName = "";
  //     this.editing[listing_id] = false;
  //     this.commonServices.notification(data['msg']);
  //     console.log("Yello", data);
  //   }, (error) => {
  //     this.commonServices.errorHandler(error);
  //   });
  // }

  deleteList(listing_id, index) {
    const request = {
      action_url: '/spaces/listing/' + listing_id,
      method: 'DELETE',
      params: {}
    }
    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe((data: any) => {
      this.commonServices.dismissLoading();
      this.wishlists.splice(index, 1);
      this.totalWishlists--;
      this.commonServices.notification(data['msg']);
    }, (error) => {
      this.commonServices.dismissLoading();
      this.commonServices.errorHandler(error);
    });
  }

  getWishlists(pageNumber) {
    this.page = pageNumber;
    const request = {
      action_url: '/spaces/listing',
      method: 'GET',
      params: {
        page: pageNumber,
        limit: 10,
        showImage: true,
      }
    }
    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe((data: any) => {
      console.log("Yello", data);
      this.wishlists = data['data'];
      this.totalWishlists = data['total_count']
      this.commonServices.dismissLoading();
    },
      err => {
        this.commonServices.errorHandler(err);
        this.commonServices.dismissLoading();
      });
  }

  ngOnInit() {
    this.getWishlists(0);
  }

}
