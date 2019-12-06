import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SidenavComponent } from './sidenav.component';
import { UserModule } from '../user-module/user-module';
import { SpacesModule } from '../spaces/spaces.module';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { LoaderComponent } from './loader/loader';
import { NewSearchModule } from '../new-search/new-search.module';
import { BsDropdownModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    SidenavComponent,
    UserAvatarComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    UserModule,
    SpacesModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentsModule,
    PipesModule,
    NewSearchModule,
    BsDropdownModule.forRoot(),
  ],
  exports: [
    SidenavComponent,
    LoaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SidenavModule { }
