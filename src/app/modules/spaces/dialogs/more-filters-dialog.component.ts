import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder } from "@angular/forms";

@Component({
    selector: 'more-filters-dialog',
    templateUrl: './more-filters-dialog.component.html',
    styleUrls: ['./more-filters-dialog.component.scss'],
})
export class MoreFiltersDialogComponent implements OnInit {
    misc_data: any;
    searchAmenity: Array<string> = [];
    searchAccessibility: Array<string> = [];
    searchSpaceRule: Array<string> = [];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<MoreFiltersDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data
    ) {
        this.misc_data = data.misc_data;
        this.searchAmenity = data.searchAmenity;
        this.searchAccessibility = data.searchAccessibility;
        this.searchSpaceRule = data.searchSpaceRule;
    }

    ngOnInit() {

    }

    handleAmenities(event, amenity) {
        if (event.checked) {
            this.searchAmenity.push(amenity);
        } else {
            let index = this.searchAmenity.indexOf(amenity);
            if (index != -1) this.searchAmenity.splice(index, 1);
        }
    }

    checkAmenity(amenity) {
        let index = this.searchAmenity.indexOf(amenity);
        return index !== -1;
    }

    handleAccessibilities(event, accessibility) {
        if (event.checked) {
            this.searchAccessibility.push(accessibility);
        } else {
            let index = this.searchAccessibility.indexOf(accessibility);
            if (index != -1) this.searchAccessibility.splice(index, 1);
        }
    }

    checkAccessibility(accessibility) {
        let index = this.searchAccessibility.indexOf(accessibility);
        return index !== -1;
    }

    handleSpaceRules(event, rule) {
        if (event.checked) {
            this.searchSpaceRule.push(rule);
        } else {
            let index = this.searchSpaceRule.indexOf(rule);
            if (index != -1) this.searchSpaceRule.splice(index, 1);
        }
    }

    checkSpaceRule(rule) {
        let index = this.searchSpaceRule.indexOf(rule);
        return index !== -1;
    }

    clear() {
        this.searchAmenity = []
        this.searchAccessibility = [];
        this.searchSpaceRule = [];
        // this.save();
    }

    save() {
        this.dialogRef.close({
            searchAmenity: this.searchAmenity,
            searchAccessibility: this.searchAccessibility,
            searchSpaceRule: this.searchSpaceRule,
        });
    }

    close() {
        this.dialogRef.close();
    }
}