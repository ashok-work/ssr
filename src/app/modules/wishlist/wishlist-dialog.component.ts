import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder } from "@angular/forms";
import { CommonService } from "../../services/common-service/common.service";
import { Router } from "@angular/router";

@Component({
    selector: 'wishlist-dialog',
    templateUrl: './wishlist-dialog.component.html',
    styleUrls: ['./wishlist-dialog.component.scss']
})
export class WishlistDialogComponent implements OnInit {


    wishlist: { [key: string]: any } = {};
    spaces: Array<{ [key: string]: any }> = [];
    loading = true;

    constructor(
        public fb: FormBuilder,
        public dialogRef: MatDialogRef<WishlistDialogComponent>,
        public commonServices: CommonService,
        public router: Router,
        @Inject(MAT_DIALOG_DATA) data
    ) {
        this.wishlist = data;
        this.getSpaces();

        this.dialogRef.backdropClick().subscribe(_ => {
            this.dialogRef.close(this.wishlist);
        });
    }

    ngOnInit() {

    }

    getSpaces() {
        const request = {
            action_url: '/spaces/listing/' + this.wishlist['listing_id'],
            method: 'GET',
            params: {}
        };
        this.commonServices.presentLoading();
        this.commonServices.doHttp(request).subscribe((data: any) => {
            this.spaces = data;
            console.log(data);
            this.loading = false;
            this.commonServices.dismissLoading();
        }, (error) => {
            this.commonServices.errorHandler(error);
            console.log(error);
            this.loading = false;
            this.commonServices.dismissLoading();
        })
    }

    deleteSpaceFromList(space_id, index) {
        const request = {
            action_url: '/spaces/listing/space',
            method: 'PUT',
            params: {
                'space_id': space_id,
                'listing_id': this.wishlist['listing_id']
            }
        };
        this.commonServices.doHttp(request).subscribe((data: any) => {
            this.spaces.splice(index, 1);
            this.wishlist['spaces'].splice(index, 1);
            this.commonServices.notification(data['msg']);
            if (this.wishlist['spaces'] == null || this.wishlist['spaces'].length == 0)
                this.dialogRef.close(this.wishlist);
        }, (error) => {
            this.commonServices.errorHandler(error);
        });
    }

    navigate(space_id) {
        window.open('details/' + space_id, '_blank');
    }
}