import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { PreviewCardComponent } from './preview-card.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { CommonComponentsModule } from 'src/app/modules/common-components/common-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PreviewCardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CommonComponentsModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    PreviewCardComponent
  ]
})
export class PreviewCardModule { }
