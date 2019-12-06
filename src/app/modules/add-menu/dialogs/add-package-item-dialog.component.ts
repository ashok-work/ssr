import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { CommonService } from "../../../services/common-service/common.service";
import { FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";

@Component({
    selector: 'add-package-item-dialog',
    templateUrl: './add-package-item-dialog.component.html',
    styleUrls: ['./add-package-item-dialog.component.scss']
})
export class AddPackageItemDialogComponent implements OnInit {

    category_id: any;
    item_form: any;
    item: any;

    constructor(
        public commonServices: CommonService,
        public fb: FormBuilder,
        public dialogRef: MatDialogRef<AddPackageItemDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
    ) {
        this.item_form = this.fb.group({
            category_id: [null, Validators.required],
            name: [null, Validators.required],
            description: [null],
            options: this.fb.array([
                new FormControl('')
            ]),
        });

        this.item_form.patchValue({
            category_id: data.category_id
        });

        if (data.item) {
            this.item = data.item;

            this.item_form.patchValue({
                name: this.item.name,
                description: this.item.description,
            });

            if (this.item.options.length > 0 && !this.item.options[0].isEmpty) this.item_form.get('options').removeAt(0);

            for (let option of this.item.options) {
                if (!option.isEmpty) this.item_form.get('options').push(new FormControl(option));
            }
        }

        this.dialogRef.backdropClick().subscribe(_ => {
            this.dialogRef.close();
        });
    }

    ngOnInit() {

    }

    addOption() {
        let options = this.item_form.get('options') as FormArray;
        options.push(new FormControl(''));
    }

    deleteOption(index?: any) {
        let options = this.item_form.get('options') as FormArray;
        if (options.length == 1) return;
        if (index) {
            options.removeAt(index - 1);
        } else {
            options.removeAt(options.length - 1);
        }
    }

    addItem() {
        if (!this.item_form.valid) return;

        const request = {
            action_url: '/catering/item',
            method: 'POST',
            params: this.item_form.value,
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
        if (!this.item_form.valid) return;

        let params = {
            item_id: this.item.item_id,
            name: this.item_form.value.name,
            category_id: this.item_form.value.category_id,
            options: this.item_form.value.options,
            description: this.item_form.value.description,
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
                this.item.name = this.item_form.value.name;
                this.item.description = this.item_form.value.description;
                this.item.options = this.item_form.value.options;
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