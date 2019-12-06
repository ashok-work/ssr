import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common-service/common.service';
import { AddPayoutDialogComponent } from './add-payout-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-payout-preferences',
  templateUrl: './payout-preferences.component.html',
  styleUrls: ['./payout-preferences.component.scss']
})
export class PayoutPreferencesComponent implements OnInit {

  payoutMethods: any = [];

  constructor(
    public commonServices: CommonService,
    public dialog: MatDialog
  ) {
    this.commonServices.setTitle('Payout Preferences');
  }

  ngOnInit() {
    this.getPayouts();
  }

  getPayouts() {
    const request = {
      action_url: '/payment_preference',
      method: 'GET',
      params: {}
    }

    this.commonServices.doHttp(request).subscribe(
      (data: Array<Object>) => {
        this.payoutMethods = data;
      },
      err => {
        this.commonServices.errorHandler(err);
      }
    );
  }

  openAddPayoutDialog() {
    const dialogRef = this.dialog.open(AddPayoutDialogComponent, {
      width: '450px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.payoutMethods.push(result);
    });
  }

  updateMethod(index) {
    const dialogRef = this.dialog.open(AddPayoutDialogComponent, {
      width: '450px',
      data: this.payoutMethods[index]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.payoutMethods[index]['account'] = result;
    });
  }

  deleteMethod(preference_id, index) {
    let request = {
      action_url: '/payment_preference/' + preference_id,
      method: 'DELETE',
      params: {}
    }

    this.commonServices.doHttp(request).subscribe(
      data => {
        this.commonServices.notification(data['msg']);
        this.payoutMethods.splice(index, 1);
      },
      err => {
        this.commonServices.errorHandler(err);
      }
    );
  }

  setDefaultMethod(preference_id, index) {
    let request = {
      action_url: '/payment_preference/is_default',
      method: 'PUT',
      params: {
        preference_id: preference_id
      }
    }

    this.commonServices.doHttp(request).subscribe(
      data => {
        this.commonServices.notification(data['msg']);
        for (let method of this.payoutMethods) {
          method['is_default'] = false;
        }
        this.payoutMethods[index]['is_default'] = true;
      },
      err => {
        this.commonServices.errorHandler(err);
      }
    );
  }

}
