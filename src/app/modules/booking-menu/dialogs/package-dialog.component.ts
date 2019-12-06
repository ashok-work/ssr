import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { CommonService } from "../../../services/common-service/common.service";

@Component({
    selector: 'package-dialog',
    templateUrl: './package-dialog.component.html',
    styleUrls: ['./package-dialog.component.scss']
})
export class PackageDialogComponent implements OnInit {

    package: any;
    total_price: number;
    quantity: any;
    selection: any = {};

    constructor(
        public commonServices: CommonService,
        public dialogRef: MatDialogRef<PackageDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
    ) {
        if (data.package) {
            this.package = data.package;
            this.quantity = this.package.min_quantity;

            for (let item of this.package.items) {
                this.selection[item.name] = '';
            }
        }

        this.dialogRef.backdropClick().subscribe(_ => {
            this.dialogRef.close();
        });
    }

    ngOnInit() {
        this.total_price = this.package.price * this.package.min_quantity;
    }

    calculatePrice() {
        if (this.quantity < this.package.min_quantity) {
            this.total_price = 0;
            return;
        }
        this.total_price = this.package.price * this.quantity;
    }

    checkMinQuantity() {
        // if (this.quantity < this.package.min_quantity) this.quantity = this.package.min_quantity;
        // this.calculatePrice();
    }

    submit() {
        this.dialogRef.close({
            quantity: this.quantity,
            price: this.total_price,
            selection: this.selection,
        })
    }

    close() {
        this.dialogRef.close();
    }
}