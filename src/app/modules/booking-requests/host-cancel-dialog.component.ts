import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder } from "@angular/forms";

@Component({
    selector: 'host-cancel-dialog',
    templateUrl: './host-cancel-dialog.component.html'
})
export class HostCancelDialogComponent implements OnInit {

    bookingId: any;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<HostCancelDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data
    ) {
        this.bookingId = data.bookingId
    }

    ngOnInit() {

    }

    close() {
        this.dialogRef.close(false);
    }

    save() {
        this.dialogRef.close(true);
    }
} 