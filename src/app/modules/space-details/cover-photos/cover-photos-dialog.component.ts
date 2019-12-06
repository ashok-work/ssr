import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder } from "@angular/forms";

@Component({
    selector: 'cover-photos-dialog',
    templateUrl: './cover-photos-dialog.component.html',
    styleUrls: ['./cover-photos-dialog.component.scss']
})
export class CoverPhotosDialogComponent implements OnInit {

    photos: Array<Object> = [];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CoverPhotosDialogComponent>,
        @Inject (MAT_DIALOG_DATA) data
    ) {
        this.photos = data;
    }

    ngOnInit () {

    }

    closeDialog() {
        this.dialogRef.close();
    }
}