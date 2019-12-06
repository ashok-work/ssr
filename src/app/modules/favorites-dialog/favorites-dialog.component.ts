import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { UtilsService } from "src/app/services/utils/utils.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-favorites-dialog',
  templateUrl: './favorites-dialog.component.html',
  styleUrls: ['./favorites-dialog.component.scss'],
})
export class FavoritesDialogComponent implements OnInit {
  space_data: any;

  constructor(
    public utils: UtilsService,
    public router: Router,
    public dialogRef: MatDialogRef<FavoritesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.space_data = data.space_data;
  }

  ngOnInit() {

  }

  close() {
    this.dialogRef.close();
  }
}