import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder } from "@angular/forms";

@Component({
    selector: 'guests-dialog',
    templateUrl: './guests-dialog.component.html',
    styleUrls: ['./guests-dialog.component.scss'],
})
export class GuestsDialogComponent implements OnInit {
    
    guestCount: number;
    
    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<GuestsDialogComponent>,
        @Inject (MAT_DIALOG_DATA) data
    ) {
        this.guestCount = data.guestCount;
    }

    ngOnInit () {

    }

    checkGuestCount() {
        if(this.guestCount < 0) {
            this.guestCount = 0;
        }
    }

    increaseGuests() {
        this.guestCount++;
    }

    decreaseGuests() {
        if(this.guestCount >= 1) this.guestCount--;
    }

    clear() {
        this.guestCount = 0;
        this.save();
    }

    save() {
        if(this.guestCount < 0) this.guestCount = 0;
        this.dialogRef.close(this.guestCount);
    }
}