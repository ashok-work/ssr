import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common-service/common.service';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { TransactionDialogComponent } from './transaction-dialog.component';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit {

  totalCompletedTransactions: any;
  completedTransactions: any = [];
  completedTransactionsDataSource: any = new MatTableDataSource<ITransactionHistory>([]);
  completedOutstandingAmount: any;
  completedSettlementAmount: any;
  completedFilters: any = {
    page: 0,
    limit: 10,
    type: 'completed',
    from_date: new Date(new Date().setDate(new Date().getDate() - 90)).toISOString(),
    to_date: new Date().toISOString(),
    space_id: '',
    payout_id: ''
  };

  totalUpcomingTransactions: any;
  upcomingTransactions: any = [];
  upcomingTransactionsDataSource: any = new MatTableDataSource<ITransactionHistory>([]);
  upcomingOutstandingAmount: any;
  upcomingSettlementAmount: any;
  upcomingFilters: any = {
    page: 0,
    limit: 10,
    type: 'upcoming',
    space_id: ''
  };

  grossEarnings: any = [];
  totalEarnings: any = {};
  grossEarningsDataSource: any = new MatTableDataSource<IGrossEarnings>([]);
  grossEarningsFilters: any = {
    from_date: new Date(new Date().setDate(new Date().getDate() - 90)).toISOString(),
    to_date: new Date().toISOString(),
  }
  grossEarningsColumns = ['paymentMethod', 'grossEarnings', 'serviceFee', 'totalPaid'];

  spaces: any = [];
  payoutMethods: any = [];
  flag1 = false;
  flag2 = false;
  displayedColumns: string[] = ['name', 'outstandingAmount', 'settlementAmount', 'startDate', 'actions'];

  constructor(
    public commonServices: CommonService,
    public dialog: MatDialog,
  ) {
    this.commonServices.setTitle('Transaction History');
  }

  ngOnInit() {
    this.getMySpaces();
  }

  openTransactionDialog(date) {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '700px',
      data: {
        date: date,
        space_id: this.completedFilters['space_id']
      }
    });
  }

  getMySpaces() {
    const request = {
      params: {
        page: 0,
        limit: 50
      },
      method: 'GET',
      action_url: '/spaces/my_spaces/list'
    };
    this.commonServices.doHttp(request).subscribe(
      data => {
        this.spaces = data['data'];
        this.getMyPayouts();
      },
      err => {
        this.commonServices.errorHandler(err);
      }
    );
  }

  getMyPayouts() {
    const request = {
      action_url: '/payment_preference',
      method: 'GET',
      params: {}
    }

    this.commonServices.doHttp(request).subscribe(
      (data: Array<Object>) => {
        this.payoutMethods = data;
        this.getCompletedTransactions(true);
      },
      err => {
        this.commonServices.errorHandler(err);
      }
    );
  }

  getCompletedTransactions(callUpcomingTransactions: any = false) {

    const request = {
      action_url: '/spaces/transactions',
      method: 'GET',
      params: Object.assign({}, this.completedFilters),
    };

    if (!this.completedFilters.space_id) {
      delete request.params.space_id;
    }
    if (!this.completedFilters.payout_id) {
      delete request.params.payout_id;
    }

    this.commonServices.doHttp(request).subscribe(data => {
      console.log(data);

      this.totalCompletedTransactions = data['total_count'];
      this.completedTransactions = data['items'];
      this.completedOutstandingAmount = data['total_outstanding_amount'];
      this.completedSettlementAmount = data['total_settlement_amount'];
      this.flag1 = true;

      if (this.completedTransactions.length <= 0) {
        console.log("Inside");
        this.completedTransactionsDataSource = new MatTableDataSource<ITransactionHistory>([]);
      } else {
        this.completedTransactionsDataSource = new MatTableDataSource(<any>this.completedTransactions)
      }

      if (callUpcomingTransactions) this.getUpcomingTransactions(true);
    }, err => {
      this.commonServices.errorHandler(err);
    });
  }

  getUpcomingTransactions(callGrossEarnings: any = false) {
    const request = {
      action_url: '/spaces/transactions',
      method: 'GET',
      params: Object.assign({}, this.upcomingFilters),
    };

    if (!this.upcomingFilters.space_id) {
      delete request.params.space_id;
    }

    this.commonServices.doHttp(request).subscribe(data => {
      console.log(data);
      this.totalUpcomingTransactions = data['total_count'];
      this.upcomingTransactions = data['items'];
      this.upcomingOutstandingAmount = data['total_outstanding_amount'];
      this.upcomingSettlementAmount = data['total_settlement_amount'];
      this.flag2 = true;

      if (this.upcomingTransactions.length <= 0) {
        this.upcomingTransactionsDataSource = new MatTableDataSource(<any>[{}]);
      } else {
        this.upcomingTransactionsDataSource = new MatTableDataSource(<any>this.upcomingTransactions)
      }

      if (callGrossEarnings) this.getGrossEarnings();
    }, err => {
      this.commonServices.errorHandler(err);
    });
  }

  getGrossEarnings() {
    const request = {
      action_url: '/spaces/gross_earnings',
      method: 'GET',
      params: Object.assign({}, this.grossEarningsFilters),
    };

    this.commonServices.doHttp(request).subscribe(
      data => {
        console.log(data);
        this.grossEarnings = data;
        if (this.grossEarnings.length <= 0) {
          this.grossEarningsDataSource = new MatTableDataSource(<any>[{}]);
        } else {
          this.grossEarningsDataSource = new MatTableDataSource(<any>this.grossEarnings)
        }
      },
      err => {
        this.commonServices.errorHandler(err);
      }
    )
  }

  getPrevCompletedTransactions() {
    if (this.completedFilters['page'] > 0) this.completedFilters['page']--;
    this.getCompletedTransactions(false);
  }

  getNextCompletedTransactions() {
    this.completedFilters['page']++;
    this.getCompletedTransactions(false);
  }

  getPrevUpcomingTransactions() {
    if (this.upcomingFilters['page'] > 0) this.upcomingFilters['page']--;
    this.getUpcomingTransactions();
  }

  getNextUpcomingTransactions() {
    this.upcomingFilters['page']++;
    this.getUpcomingTransactions();
  }

  fromDateSelected(event) {
    this.completedFilters['page'] = 0;
    this.completedFilters['from_date'] = event.value.toISOString();
    this.getCompletedTransactions(false);
  }

  toDateSelected(event) {
    this.completedFilters['page'] = 0;
    this.completedFilters['to_date'] = event.value.toISOString();
    this.getCompletedTransactions(false);
  }

  completedSpaceSelected(event) {
    this.completedFilters['page'] = 0;
    this.completedFilters['space_id'] = event.value;
    this.getCompletedTransactions(false);
  }

  upcomingSpaceSelected(event) {
    this.completedFilters['page'] = 0;
    this.upcomingFilters['space_id'] = event.value;
    this.getUpcomingTransactions();
  }

  completedPayoutSelected(event) {
    this.completedFilters['page'] = 0;
    this.completedFilters['payout_id'] = event.value;
    this.getCompletedTransactions(false);
  }

  grossFromDateSelected(event) {
    this.grossEarningsFilters['from_date'] = event.value.toISOString();
    this.getGrossEarnings();
  }

  grossToDateSelected(event) {
    this.grossEarningsFilters['to_date'] = event.value.toISOString();
    this.getGrossEarnings();
  }
}

export interface ITransactionHistory {
  name: string;
  outstanding_amount: number;
  settlement_amount: number;
  start_date: string;
}

export interface IGrossEarnings {
  payment_method: string;
  gross_earnings: number;
  service_fee: number;
  total_paid: number;
}
