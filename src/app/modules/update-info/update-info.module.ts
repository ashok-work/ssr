import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateInfoComponent } from './update-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { OperatingHoursModule } from '../operating-hours/operating-hours.module';
import { OperatingHoursComponent } from '../operating-hours/operating-hours.component';

@NgModule({
  declarations: [
    UpdateInfoComponent,
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
        path: ':space_id/:space_name', component: UpdateInfoComponent,
      }
    ])
  ]
})
export class UpdateInfoModule { }
