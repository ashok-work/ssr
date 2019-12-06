import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    MaterialModule,
    RouterModule.forChild([
      {
        path: '', component: ChatComponent
      }
    ])
  ]
})
export class ChatModule { }
