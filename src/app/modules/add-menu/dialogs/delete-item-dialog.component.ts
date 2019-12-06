import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { CommonService } from "src/app/services/common-service/common.service";

@Component({
    selector: 'delete-item-dialog',
    templateUrl: './delete-item-dialog.component.html',
    styleUrls: ['./delete-item-dialog.component.scss']
})
export class DeleteItemDialogComponent implements OnInit {

    constructor(
        public commonServices: CommonService,
        public dialogRef: MatDialogRef<DeleteItemDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
    ) {
        this.dialogRef.backdropClick().subscribe(_ => {
            this.dialogRef.close(false);
        });
    }

    ngOnInit() {

    }

    save() {
        this.dialogRef.close(true);
    }

    close() {
        this.dialogRef.close(false);
    }
}