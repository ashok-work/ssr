import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { CommonService } from "../../../services/common-service/common.service";

@Component({
    selector: 'item-dialog',
    templateUrl: './item-dialog.component.html',
    styleUrls: ['./item-dialog.component.scss']
})
export class ItemDialogComponent implements OnInit {

    item: any;
    total_price: number;
    quantity: any;

    constructor(
        public commonServices: CommonService,
        public dialogRef: MatDialogRef<ItemDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
    ) {
        if (data.item) {
            this.item = data.item;
            this.quantity = this.item.min_quantity;
        }

        this.dialogRef.backdropClick().subscribe(_ => {
            this.dialogRef.close();
        });
    }

    ngOnInit() {
        this.total_price = this.item.price * this.item.min_quantity;
    }

    calculatePrice() {
        if (this.quantity < this.item.min_quantity) {
            this.total_price = 0;
            return;
        }
        this.total_price = this.item.price * this.quantity;
    }

    checkMinQuantity() {
        // if (this.quantity < this.item.min_quantity) this.quantity = this.item.min_quantity;
        // this.calculatePrice();
    }

    submit() {
        console.log(this.quantity);
        console.log(this.total_price);
        this.dialogRef.close({
            quantity: this.quantity,
            price: this.total_price,
            selection: {},
        })
    }

    close() {
        this.dialogRef.close();
    }
}