import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewSpaceComponent } from './new-space.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { PipesModule } from '../../pipes/pipes.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { IonicModule } from '@ionic/angular';
import { CustomDirectivesModule } from 'src/app/directive/custom-directives.module';

@NgModule({
  declarations: [
    NewSpaceComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    CommonComponentsModule,
    PipesModule,
    CustomDirectivesModule,
    RouterModule.forChild([
      {
        path: '', component: NewSpaceComponent
      },
      {
        path: ':space_id', component: NewSpaceComponent
      }
    ])
  ]
})
export class NewSpaceModule { }
