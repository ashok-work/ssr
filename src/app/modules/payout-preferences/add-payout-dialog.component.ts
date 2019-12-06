import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { CommonService } from "../../services/common-service/common.service";
import { UtilsService } from "../../services/utils/utils.service";

@Component({
    selector: 'add-payout-dialog',
    templateUrl: './add-payout-dialog.component.html',
    styleUrls: ['./add-payout-dialog.component.scss']
})
export class AddPayoutDialogComponent implements OnInit {

    methodObj: any;
    updateFlag = false;
    payoutForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AddPayoutDialogComponent>,
        public commonServices: CommonService,
        public utils: UtilsService,
        @Inject(MAT_DIALOG_DATA) data
    ) {
        this.methodObj = data;
        this.payoutForm = this.fb.group({
            title: [null, Validators.required],
            bank_name: [null, Validators.required],
            account_name: [null, Validators.required],
            account_number: [null, Validators.required],
            ifsc_code: [null, Validators.required],
            pan: [null, Validators.required],
            account_type: [null, Validators.required]
        });
    }

    ngOnInit() {
        if (JSON.stringify(this.methodObj) != JSON.stringify({})) {
            this.updateFlag = true;
            this.payoutForm.patchValue({
                title: this.methodObj['account']['title'],
                bank_name: this.methodObj['account']['bank_name'],
                account_name: this.methodObj['account']['account_name'],
                account_number: this.methodObj['account']['account_number'],
                ifsc_code: this.methodObj['account']['ifsc_code'],
                pan: this.methodObj['account']['pan'],
                account_type: this.methodObj['account']['account_type']
            });
        }
    }

    save() {
        console.log(this.payoutForm.value);
        if (this.payoutForm.valid) {
            let request = {
                action_url: '/payment_preference',
                method: 'POST',
                params: {
                    account: this.payoutForm.value,
                }
            }

            this.commonServices.doHttp(request).subscribe(
                data => {
                    let result = {};
                    result['account'] = this.payoutForm.value;
                    result['preference_id'] = data['preference_id'];
                    result['is_default'] = data['is_default'];
                    this.commonServices.notification(data['msg']);
                    this.dialogRef.close(result);
                },
                err => {
                    this.commonServices.errorHandler(err);
                }
            );
        }
    }

    update() {
        console.log(this.payoutForm.value);
        if (this.payoutForm.valid) {
            let request = {
                action_url: '/payment_preference',
                method: 'PUT',
                params: {
                    account: this.payoutForm.value,
                    preference_id: this.methodObj['preference_id']
                }
            }

            this.commonServices.doHttp(request).subscribe(
                data => {
                    let result = {};
                    result = this.payoutForm.value;
                    this.commonServices.notification(data['msg']);
                    this.dialogRef.close(result);
                },
                err => {
                    this.commonServices.errorHandler(err);
                }
            );
        }
    }

    close() {
        this.dialogRef.close(false);
    }
}