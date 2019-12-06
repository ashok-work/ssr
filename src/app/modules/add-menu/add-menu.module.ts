import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMenuComponent } from './add-menu.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { AddCategoryDialogComponent } from './dialogs/add-category-dialog.component';
import { AddPackageDialogComponent } from './dialogs/add-package-dialog.component';
import { DeleteCategoryDialogComponent } from './dialogs/delete-category-dialog.component';
import { DeleteItemDialogComponent } from './dialogs/delete-item-dialog.component';
import { AddItemDialogComponent } from './dialogs/add-item-dialog.component';
import { AddPackageItemDialogComponent } from './dialogs/add-package-item-dialog.component';

@NgModule({
  declarations: [
    AddMenuComponent,
    AddCategoryDialogComponent,
    AddPackageDialogComponent,
    DeleteCategoryDialogComponent,
    DeleteItemDialogComponent,
    AddItemDialogComponent,
    AddPackageItemDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CommonComponentsModule,
    PipesModule,
    RouterModule.forChild([
      {
        path: ':space_id/:space_name', component: AddMenuComponent
      },
    ])
  ],
  entryComponents: [
    AddCategoryDialogComponent,
    AddPackageDialogComponent,
    DeleteCategoryDialogComponent,
    DeleteItemDialogComponent,
    AddItemDialogComponent,
    AddPackageItemDialogComponent,
  ]
})
export class AddMenuModule { }
