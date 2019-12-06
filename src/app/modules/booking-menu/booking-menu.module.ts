import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingMenuComponent } from './booking-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MaterialModule } from 'src/app/material.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { RouterModule } from '@angular/router';
import { PackageDialogComponent } from './dialogs/package-dialog.component';
import { ItemDialogComponent } from './dialogs/item-dialog.component';

@NgModule({
  declarations: [
    BookingMenuComponent,
    PackageDialogComponent,
    ItemDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    CommonComponentsModule,
    RouterModule.forChild([
      {
        path: ':space_id/:space_name', component: BookingMenuComponent,
      }
    ])
  ],
  entryComponents: [
    PackageDialogComponent,
    ItemDialogComponent,
  ]
})
export class BookingMenuModule { }
