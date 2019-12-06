import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { CommonService } from "../../../services/common-service/common.service";

@Component({
    selector: 'add-wishlist-dialog',
    templateUrl: './add-wishlist-dialog.component.html',
    styleUrls: ['./add-wishlist-dialog.component.scss']
})
export class AddWishlistDialogComponent implements OnInit {

    wishlist_name: any;

    constructor(
        public commonServices: CommonService,
        public dialogRef: MatDialogRef<AddWishlistDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
    ) {
        this.dialogRef.backdropClick().subscribe(_ => {
            this.dialogRef.close();
        });
    }

    ngOnInit() {

    }

    addList() {
        if(this.wishlist_name != null && this.wishlist_name != '') this.dialogRef.close(this.wishlist_name);
        else this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }
}