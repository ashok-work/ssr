import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterContentInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../../services/utils/utils.service';
@Component({
  selector: 'country-code-dropdown',
  templateUrl: './country-code-dropdown.component.html',
  styleUrls: ['./country-code-dropdown.component.scss']
})
export class CountryCodeDropdownComponent implements OnInit {
  @Output('onSelection') onSelection = new EventEmitter<string>();
  @Input('isbglight') isbglight: boolean;
  @ViewChild('options') options: ElementRef;
  currentCode = "IN";
  showDropDown = false;
  timer: any;

  @Input('width') set optionsWidth(width: string) {
    this.renderer.setStyle(this.options.nativeElement, 'width', width)
  };

  constructor(public renderer: Renderer2, public utilsService: UtilsService) { }

  ngOnInit() {
    if (this.utilsService.user && this.utilsService.user.carrier_code) {
      this.currentCode = this.utilsService.user.carrier_code
    } else {
      this.currentCode = environment.country_code.toUpperCase();
    }

  }

  onMouseEnter() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.showDropDown = !this.showDropDown;
  }

  onSelctOption(code: string) {
    this.currentCode = code;
    this.showDropDown = false;
    this.onSelection.emit(code);
  }

  onMouseLeave() {
    this.timer = setTimeout(() => {
      this.showDropDown = false;
    }, 300);
  }

}
