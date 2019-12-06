import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder } from "@angular/forms";
import { CommonService } from "../../services/common-service/common.service";
import { UtilsService } from "../../services/utils/utils.service";

@Component({
    selector: 'cancel-dialog',
    templateUrl: './cancel-dialog.component.html'
})
export class CancelDialogComponent implements OnInit {

    policy: any;
    bookingId: any;
    refundAmount: any;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CancelDialogComponent>,
        public commonServices: CommonService,
        public utils: UtilsService,
        @Inject(MAT_DIALOG_DATA) data
    ) {
        this.policy = data.policy;
        this.bookingId = data.bookingId
    }

    ngOnInit() {
        this.getRefundInfo();
    }

    getRefundInfo() {
        const request = {
            action_url: '/spaces/booking/' + this.bookingId + '/refund_info',
            method: 'GET',
            params: {}
        }

        this.commonServices.doHttp(request).subscribe(
            data => {
                this.refundAmount = data['amount'];
            },
            err => {
                this.commonServices.errorHandler(err);
            }
        );
    }

    close() {
        this.dialogRef.close(false);
    }

    save() {
        this.dialogRef.close(true);
    }
}