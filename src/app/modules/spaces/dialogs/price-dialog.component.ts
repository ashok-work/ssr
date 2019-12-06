import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder } from "@angular/forms";

@Component({
    selector: 'price-dialog',
    templateUrl: './price-dialog.component.html',
    styleUrls: ['./guests-dialog.component.scss']
})
export class PriceDialogComponent implements OnInit {
    
    priceRange = {};
    min = 0;
    max = 5000;
    
    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<PriceDialogComponent>,
        @Inject (MAT_DIALOG_DATA) data
    ) {
        this.priceRange = data.priceRange;
        this.min = data.min;
        this.max = data.max
    }

    ngOnInit () {

    }

    clear() {
        this.priceRange = {
            lower: 0,
            upper: 5000
        }
        this.save();
    }

    save() {
        this.dialogRef.close(this.priceRange);
    }
}