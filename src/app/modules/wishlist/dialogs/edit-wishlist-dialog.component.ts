import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder } from "@angular/forms";
import { CommonService } from "../../../services/common-service/common.service";
import { Router } from "@angular/router";

@Component({
    selector: 'edit-wishlist-dialog',
    templateUrl: './edit-wishlist-dialog.component.html',
    styleUrls: ['./edit-wishlist-dialog.component.scss']
})
export class EditWishlistDialogComponent implements OnInit {

    wishlist: any;

    constructor(
        public commonServices: CommonService,
        public dialogRef: MatDialogRef<EditWishlistDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
    ) {
        this.wishlist = data;

        this.dialogRef.backdropClick().subscribe(_ => {
            this.dialogRef.close(this.wishlist);
        });
    }

    ngOnInit() {

    }

    renameList() {
        const request = {
            action_url: '/spaces/listing',
            method: 'PUT',
            params: {
                listing_name: this.wishlist.listing_name,
                listing_id: this.wishlist.listing_id
            }
        }

        this.commonServices.presentLoading();
        this.commonServices.doHttp(request).subscribe(
            data => {
                this.commonServices.dismissLoading();
                this.commonServices.notification(data['msg']);
                this.dialogRef.close(this.wishlist);
            },
            err => {
                this.commonServices.dismissLoading();
                this.commonServices.errorHandler(err);
                this.dialogRef.close(this.wishlist);
            }
        )
    }

    close() {
        this.dialogRef.close(this.wishlist);
    }
}