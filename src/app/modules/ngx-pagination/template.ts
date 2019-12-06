/**
 * The default template and styles for the pagination links are borrowed directly
 * from Zurb Foundation 6: http://foundation.zurb.com/sites/docs/pagination.html
 */

export const DEFAULT_TEMPLATE = `
    <pagination-template #p="paginationApi" [id]="id" [maxSize]="maxSize" (pageChange)="pageChange.emit($event)">
      <ul
        class="ngx-pagination d-flex justify-content-center align-items-center pl-0 bg-white br-6 border py-2 grey-border-imp"
        role="navigation" [attr.aria-label]="screenReaderPaginationLabel" [class.responsive]="responsive"
        *ngIf="!(autoHide && p.pages.length <= 1)">

        <span class="font-roman text-default small-text ml-3 ranges">
          {{p.getRangeBegin()}} - {{p.getRangeEnd()}} of {{p.getTotalItems()}}
        </span>

        <li class="pagination-previous mr-sm-3" [class.disabled]="p.isFirstPage()" *ngIf="directionLinks">
          <a tabindex="0" *ngIf="1 < p.getCurrent()" (keyup.enter)="p.previous()" (click)="p.previous()"
            [attr.aria-label]="previousLabel + ' ' + screenReaderPageLabel">
            <i class="fas fa-chevron-left"></i>
          </a>
          <span *ngIf="p.isFirstPage()">
            <i class='fas fa-chevron-left'></i>
          </span>
        </li>

        <li class="small-screen">
          {{ p.getCurrent() }} / {{ p.getLastPage() }}
        </li>

        <li [class.current]="p.getCurrent() === page.value" [class.ellipsis]="page.label === '...'"
          *ngFor="let page of p.pages">
          <a tabindex="0" (keyup.enter)="p.setCurrent(page.value)" (click)="p.setCurrent(page.value)"
            *ngIf="p.getCurrent() !== page.value">
            <span class="show-for-sr">{{ screenReaderPageLabel }} </span>
            <span class="font-roman">{{ (page.label === '...') ? page.label : (page.label | number:'') }}</span>
          </a>
          <ng-container *ngIf="p.getCurrent() === page.value">
            <span class="show-for-sr">{{ screenReaderCurrentLabel }} </span>
            <span class="font-heavy">{{ (page.label === '...') ? page.label : (page.label | number:'') }}</span>
          </ng-container>
        </li>

        <li class="pagination-next ml-sm-3" [class.disabled]="p.isLastPage()" *ngIf="directionLinks">
          <a tabindex="0" *ngIf="!p.isLastPage()" (keyup.enter)="p.next()" (click)="p.next()"
            [attr.aria-label]="nextLabel + ' ' + screenReaderPageLabel">
            <i class='fas fa-chevron-right'></i>
          </a>
          <span *ngIf="p.isLastPage()">
            <i class='fas fa-chevron-right'></i>
          </span>
        </li>

      </ul>
    </pagination-template>
    `;

export const DEFAULT_STYLES = `
.ngx-pagination {
  margin-left: 0;
  margin-bottom: 1rem;
  position: relative;
}

.ngx-pagination .ranges {
  position: absolute;
  left: 0;
}

.ngx-pagination::before,
.ngx-pagination::after {
  content: ' ';
  display: table;
}

.ngx-pagination::after {
  clear: both;
}

.ngx-pagination li {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  margin-right: 0.0625rem;
  border-radius: 0;
}

.ngx-pagination li {
  display: inline-block;
}

.ngx-pagination a,
.ngx-pagination button {
  color: #282828 !important;
  text-decoration: none;
  display: block;
  padding: 0.1875rem 0.7rem;
  border-radius: 50%;
}

.ngx-pagination a:hover,
.ngx-pagination button:hover {
  background: #e6e6e6;
}

.ngx-pagination .current {
  padding: 0.1875rem 0.7rem;
  background: #0185DE;
  color: #fefefe;
  cursor: default;
  border-radius: 50%;
}

.ngx-pagination .disabled {
  padding: 0.1875rem 0.7rem;
  color: #cacaca;
  cursor: default;
}

.ngx-pagination .disabled:hover {
  background: transparent;
}

.ngx-pagination a,
.ngx-pagination button {
  cursor: pointer;
}

.ngx-pagination .show-for-sr {
  position: absolute !important;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

.ngx-pagination .small-screen {
  display: none;
}

@media screen and (max-width: 601px) {
  .ngx-pagination.responsive .small-screen {
    display: inline-block;
  }

  .ngx-pagination.responsive li:not(.small-screen):not(.pagination-previous):not(.pagination-next) {
    display: none;
  }
}
  `;
