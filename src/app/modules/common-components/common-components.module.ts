import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { StartRatingComponent } from '../space-details/start-rating/start-rating.component';
import { MultisearchBarComponent } from '../../components/multisearch-bar/multisearch-bar.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CarrierCodeComponent } from 'src/app/components/carrier-code/carrier-code.component';
import { FavoritesComponent } from 'src/app/components/favorites/favorites.component';

@NgModule({
  declarations: [
    StartRatingComponent,
    SearchBarComponent,
    MultisearchBarComponent,
    CarrierCodeComponent,
    FavoritesComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    StartRatingComponent,
    SearchBarComponent,
    MultisearchBarComponent,
    CarrierCodeComponent,
    FavoritesComponent,
  ]
})
export class CommonComponentsModule { }
