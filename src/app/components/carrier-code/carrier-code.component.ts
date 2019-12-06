import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-carrier-code',
  templateUrl: './carrier-code.component.html',
  styleUrls: ['./carrier-code.component.scss']
})
export class CarrierCodeComponent implements OnInit {
  @Output('onSelection') onSelection = new EventEmitter<string>();
  @Input() carrier_code;
  carrier_code_value: any;

  constructor(
    public commonServices: CommonService,
  ) { }

  ngOnInit() {
    if (this.carrier_code != null) this.carrier_code_value = this.carrier_code;
    else this.carrier_code_value = this.commonServices.info['carrier_code'].toUpperCase()
  }

  onSelect(event) {
    this.onSelection.emit(event.target.value);
  }

}
