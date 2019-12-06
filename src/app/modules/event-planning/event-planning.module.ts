import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventPlanningComponent } from './event-planning.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  declarations: [
    EventPlanningComponent
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
        path: '', component: EventPlanningComponent
      }
    ])
  ]
})
export class EventPlanningModule { }
