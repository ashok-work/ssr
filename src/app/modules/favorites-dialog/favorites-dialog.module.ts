import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesDialogComponent } from './favorites-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { CommonComponentsModule } from '../common-components/common-components.module';

@NgModule({
  declarations: [
    FavoritesDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    PipesModule,
    CommonComponentsModule,
  ],
  exports: [
    FavoritesDialogComponent,
  ],
  entryComponents: [
    FavoritesDialogComponent,
  ]
})
export class FavoritesDialogModule { }
