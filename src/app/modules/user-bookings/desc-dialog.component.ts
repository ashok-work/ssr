import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder } from "@angular/forms";
import { CommonService } from "../../services/common-service/common.service";

@Component({
    selector: 'desc-dialog',
    templateUrl: './desc-dialog.component.html',
    styleUrls: ['./desc-dialog.component.scss']
})
export class DescDialogComponent implements OnInit {

    space_id: any;
    booking_id: any;
    rating = 1;
    value = 1;
    cleanliness = 1;
    location = 1;
    accuracy = 1;
    heading = "";
    review = "";

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<DescDialogComponent>,
        public commonServices: CommonService,
        @Inject(MAT_DIALOG_DATA) data
    ) {
        this.space_id = data.booking.space_id;
        this.booking_id = data.booking.booking_id;
    }

    ngOnInit() {

    }

    addReview() {
        const request = {
            action_url: '/spaces/review',
            method: 'POST',
            params: {
                'space_id': this.space_id,
                'booking_id': this.booking_id,
                'heading': this.heading,
                'description': this.review,
                'overall_rating': this.rating,
                'value_rating': this.value,
                'cleanliness_rating': this.cleanliness,
                'location_rating': this.location,
                'accuracy_rating': this.accuracy
            }
        };
        this.commonServices.doHttp(request).subscribe((data: any) => {
            this.commonServices.notification(data['msg']);
            this.close();
        }, (error) => {
            this.commonServices.errorHandler(error);
        });
    }

    close() {
        this.dialogRef.close();
    }
}