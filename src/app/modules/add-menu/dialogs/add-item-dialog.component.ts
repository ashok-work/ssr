import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { CommonService } from "../../../services/common-service/common.service";

@Component({
    selector: 'add-item-dialog',
    templateUrl: './add-item-dialog.component.html',
    styleUrls: ['./add-item-dialog.component.scss']
})
export class AddItemDialogComponent implements OnInit {

    category_id: any;
    name: any;
    price: any;
    description: any;
    min_quantity: any;
    item: any;

    constructor(
        public commonServices: CommonService,
        public dialogRef: MatDialogRef<AddItemDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
    ) {
        this.category_id = data.category_id;
        if (data.item) {
            this.item = data.item;
            this.name = this.item.name;
            this.price = this.item.price;
            this.description = this.item.description;
            this.min_quantity = this.item.min_quantity;
        }

        this.dialogRef.backdropClick().subscribe(_ => {
            this.dialogRef.close();
        });
    }

    ngOnInit() {

    }

    addItem() {
        if (!this.name) return;

        let params = {
            name: this.name,
            category_id: this.category_id,
            price: this.price,
            description: this.description,
            min_quantity: this.min_quantity,
        }
        const request = {
            action_url: '/catering/item',
            method: 'POST',
            params: params,
        }

        this.commonServices.presentLoading();
        this.commonServices.doHttp(request).subscribe(
            data => {
                this.commonServices.dismissLoading();
                this.dialogRef.close(true);
                this.commonServices.notification(data['msg']);
            },
            err => {
                this.commonServices.dismissLoading();
                this.commonServices.errorHandler(err);
            }
        );
    }

    editItem() {
        if (!this.name) return;

        let params = {
            item_id: this.item.item_id,
            name: this.name,
            category_id: this.category_id,
            price: this.price,
            description: this.description,
            min_quantity: this.min_quantity,
        }
        const request = {
            action_url: '/catering/item',
            method: 'PUT',
            params: params,
        }

        this.commonServices.presentLoading();
        this.commonServices.doHttp(request).subscribe(
            data => {
                this.commonServices.dismissLoading();
                this.item.name = this.name;
                this.item.description = this.description;
                this.item.price = this.price;
                this.item.min_quantity = this.min_quantity;
                this.dialogRef.close(true);
                this.commonServices.notification(data['msg']);
            },
            err => {
                this.commonServices.dismissLoading();
                this.commonServices.errorHandler(err);
            }
        );
    }

    close() {
        this.dialogRef.close();
    }
}