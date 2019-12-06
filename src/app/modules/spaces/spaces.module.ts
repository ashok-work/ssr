import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { BsDropdownModule, PaginationModule } from 'ngx-bootstrap';
import { IonicModule } from '@ionic/angular';

import { SpacesComponent } from './spaces.component';
import { GuestsDialogComponent } from './dialogs/guests-dialog.component';
import { PriceDialogComponent } from './dialogs/price-dialog.component';
import { SizeDialogComponent } from './dialogs/size-dialog.component';
import { NgxDaterangepickerMd } from '../daterangepicker';
import { SpaceImagesCarouselModule } from '../space-images-carousel/space-images-carousel.module';
import { PipesModule } from '../../pipes/pipes.module';
import { CommonComponentsModule } from '../../modules/common-components/common-components.module';
import { MoreFiltersDialogComponent } from './dialogs/more-filters-dialog.component';
import { NgxPaginationModule } from '../ngx-pagination/ngx-pagination.module';
import { FavoritesDialogModule } from '../favorites-dialog/favorites-dialog.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { CustomDirectivesModule } from 'src/app/directive/custom-directives.module';

@NgModule({
  declarations: [
    SpacesComponent,
    GuestsDialogComponent,
    PriceDialogComponent,
    SizeDialogComponent,
    MoreFiltersDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxDaterangepickerMd.forRoot(),
    BsDropdownModule.forRoot(),
    IonicModule,
    CommonComponentsModule,
    PipesModule,
    FavoritesDialogModule,
    SpaceImagesCarouselModule,
    PaginationModule.forRoot(),
    NgxPaginationModule,
    GooglePlaceModule,
    CustomDirectivesModule,
    RouterModule.forChild([
      {
        path: 'spaces', component: SpacesComponent
      },
      {
        path: 'spaces/:placeId', component: SpacesComponent
      },
      {
        path: 'spaces/:placeId/:area', component: SpacesComponent
      }
    ])
  ],
  entryComponents: [
    GuestsDialogComponent,
    PriceDialogComponent,
    SizeDialogComponent,
    MoreFiltersDialogComponent,
  ]
})
export class SpacesModule { }
