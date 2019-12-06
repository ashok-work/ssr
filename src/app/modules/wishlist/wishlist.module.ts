import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

import { WishlistComponent } from './wishlist.component';
import { WishlistDialogComponent } from './wishlist-dialog.component'
import { AuthGuard } from '../../guards/auth/auth.guard';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { NgxPaginationModule } from '../ngx-pagination/ngx-pagination.module';
import { EditWishlistDialogComponent } from './dialogs/edit-wishlist-dialog.component';
import { DeleteWishlistDialogComponent } from './dialogs/delete-wishlist-dialog.component';
import { WishlistDetailsComponent } from './wishlist-details/wishlist-details.component';
import { SpaceImagesCarouselModule } from '../space-images-carousel/space-images-carousel.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DeleteSpaceDialogComponent } from './dialogs/delete-space-dialog.component';
import { AddWishlistDialogComponent } from './dialogs/add-wishlist-dialog.component';

@NgModule({
  declarations: [
    WishlistComponent,
    WishlistDialogComponent,
    AddWishlistDialogComponent,
    EditWishlistDialogComponent,
    DeleteWishlistDialogComponent,
    DeleteSpaceDialogComponent,
    WishlistDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CommonComponentsModule,
    NgxPaginationModule,
    SpaceImagesCarouselModule,
    PipesModule,
    RouterModule.forChild([
      {
        path: '', component: WishlistComponent,
        canActivate: [AuthGuard]
      },
      {
        path: ':wishlist_id/:wishlist_name', component: WishlistDetailsComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  entryComponents: [
    WishlistDialogComponent,
    AddWishlistDialogComponent,
    EditWishlistDialogComponent,
    DeleteWishlistDialogComponent,
    DeleteSpaceDialogComponent,
  ]
})
export class WishlistModule { }
