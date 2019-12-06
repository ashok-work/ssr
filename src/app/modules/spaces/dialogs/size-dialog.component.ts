import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder } from "@angular/forms";

@Component({
    selector: 'size-dialog',
    templateUrl: './size-dialog.component.html'
})
export class SizeDialogComponent implements OnInit {
    
    size: Number;
    
    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<SizeDialogComponent>,
        @Inject (MAT_DIALOG_DATA) data
    ) {
        this.size = data.size;
    }

    ngOnInit () {

    }

    close() {
        this.dialogRef.close();
    }

    save() {
        this.dialogRef.close(this.size);
    }
}