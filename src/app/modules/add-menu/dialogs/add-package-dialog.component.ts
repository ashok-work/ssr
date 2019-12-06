import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { CommonService } from "../../../services/common-service/common.service";

@Component({
    selector: 'add-package-dialog',
    templateUrl: './add-package-dialog.component.html',
    styleUrls: ['./add-package-dialog.component.scss']
})
export class AddPackageDialogComponent implements OnInit {

    space_id: any;
    catering_package_name: any;
    min_quantity: any;
    description: any;
    price: any;
    selected_category: any;

    constructor(
        public commonServices: CommonService,
        public dialogRef: MatDialogRef<AddPackageDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
    ) {
        this.space_id = data.space_id;
        if (data.selected_category) {
            this.selected_category = data.selected_category;
            this.catering_package_name = this.selected_category.category;
            this.min_quantity = this.selected_category.min_quantity;
            this.description = this.selected_category.description;
            this.price = this.selected_category.price;
        }

        this.dialogRef.backdropClick().subscribe(_ => {
            this.dialogRef.close();
        });
    }

    ngOnInit() {

    }

    addCateringPackage() {
        if (!this.catering_package_name) return;

        let params = {
            category: this.catering_package_name,
            space_id: this.space_id,
            is_catering_package: true,
            min_quantity: this.min_quantity,
            description: this.description,
            price: this.price,
        }
        const request = {
            action_url: '/catering/category',
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

    editCateringPackage() {
        if (!this.catering_package_name) return;

        let params = {
            category_id: this.selected_category.category_id,
            category: this.catering_package_name,
            space_id: this.space_id,
            is_catering_package: true,
            min_quantity: this.min_quantity,
            description: this.description,
            price: this.price,
        }
        const request = {
            action_url: '/catering/category',
            method: 'PUT',
            params: params,
        }

        this.commonServices.presentLoading();
        this.commonServices.doHttp(request).subscribe(
            data => {
                this.commonServices.dismissLoading();
                this.selected_category.category = this.catering_package_name;
                this.selected_category.description = this.description;
                this.selected_category.min_quantity = this.min_quantity;
                this.selected_category.price = this.price;
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