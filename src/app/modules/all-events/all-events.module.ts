import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { AllEventsComponent } from './all-events.component';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  declarations: [
    AllEventsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    PipesModule,
    RouterModule.forChild([
      {
        path: '', component: AllEventsComponent
      }
    ])
  ]
})
export class AllEventsModule { }
