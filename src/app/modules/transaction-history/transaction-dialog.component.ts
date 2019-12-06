import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { CommonService } from "../../services/common-service/common.service";
import { UtilsService } from "../../services/utils/utils.service";

@Component({
    selector: 'transaction-dialog',
    templateUrl: './transaction-dialog.component.html',
    styleUrls: ['./transaction-dialog.component.scss']
})
export class TransactionDialogComponent implements OnInit {

    date: any;
    details: any;
    space_id: any;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<TransactionDialogComponent>,
        public commonServices: CommonService,
        public utils: UtilsService,
        @Inject(MAT_DIALOG_DATA) data
    ) {
        this.date = data['date'];
        this.space_id = data['space_id'];
    }

    ngOnInit() {
        this.getTransactionDetails();
    }

    getTransactionDetails() {
        const request = {
            action_url: '/spaces/transaction-details',
            method: 'GET',
            params: {
                page: 0,
                limit: 50,
                transaction_date: this.date.split('T')[0],
                space_id: this.space_id
            }
        };
        this.commonServices.presentLoading();
        this.commonServices.doHttp(request).subscribe(
            data => {
                this.details = data;
                this.commonServices.dismissLoading();
            },
            err => {
                this.commonServices.dismissLoading();
                this.commonServices.errorHandler(err);
            }
        );
    }

    navigate(booking_id) {
        window.open('host/booking/' + booking_id, '_blank');
    }

    close() {
        this.dialogRef.close();
    }
}