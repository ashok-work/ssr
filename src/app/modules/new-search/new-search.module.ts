import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewSearchComponent } from './new-search.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDirectivesModule } from 'src/app/directive/custom-directives.module';

@NgModule({
  declarations: [
    NewSearchComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CustomDirectivesModule,
  ],
  exports: [
    NewSearchComponent
  ]
})
export class NewSearchModule { }
