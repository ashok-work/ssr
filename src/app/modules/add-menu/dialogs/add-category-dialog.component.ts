import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { CommonService } from "../../../services/common-service/common.service";

@Component({
    selector: 'add-category-dialog',
    templateUrl: './add-category-dialog.component.html',
    styleUrls: ['./add-category-dialog.component.scss']
})
export class AddCategoryDialogComponent implements OnInit {

    space_id: any;
    category_name: any;
    description: any;
    selected_category: any;

    constructor(
        public commonServices: CommonService,
        public dialogRef: MatDialogRef<AddCategoryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
    ) {
        this.space_id = data.space_id;
        if (data.selected_category) {
            this.selected_category = data.selected_category;
            this.category_name = this.selected_category.category;
            this.description = this.selected_category.description;
        }

        this.dialogRef.backdropClick().subscribe(_ => {
            this.dialogRef.close();
        });
    }

    ngOnInit() {

    }

    addCategory() {
        if (!this.category_name) return;

        let params = {
            category: this.category_name,
            space_id: this.space_id,
            is_catering_package: false,
            description: this.description,
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

    editCategory() {
        if (!this.category_name) return;

        let params = {
            category_id: this.selected_category.category_id,
            category: this.category_name,
            space_id: this.space_id,
            is_catering_package: false,
            description: this.description,
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
                this.selected_category.category = this.category_name;
                this.selected_category.description = this.description;
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