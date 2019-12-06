import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { NewSearchModule } from '../new-search/new-search.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';

@NgModule({
  declarations: [
    HomepageComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CommonComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    NewSearchModule,
    LazyLoadImageModule,
    RouterModule.forChild([
      {
        path: '', component: HomepageComponent
      }
    ])
  ]
})
export class HomepageModule { }
