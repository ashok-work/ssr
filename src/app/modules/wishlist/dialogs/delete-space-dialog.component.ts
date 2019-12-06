import { Component, OnInit, Inject } from "@angular/core"
import { CommonService } from "src/app/services/common-service/common.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
    selector: 'delete-space-dialog',
    templateUrl: './delete-space-dialog.component.html',
    styleUrls: ['./delete-space-dialog.component.scss']
})
export class DeleteSpaceDialogComponent implements OnInit {

    constructor(
        public commonServices: CommonService,
        public dialogRef: MatDialogRef<DeleteSpaceDialogComponent>,
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