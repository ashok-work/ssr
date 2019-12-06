import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

import { UpgradeProfileComponent } from './upgrade-profile.component';
import { CountryCodeDropdownComponent } from '../../components/country-code-dropdown/country-code-dropdown.component';
import { OtpPageComponent } from '../../components/otp-page/otp-page.component';
import { ModalModule } from 'ngx-bootstrap';
import { ProfileAvatarComponent } from './profile-avatar/profile-avatar.component';
import { PipesModule } from '../../pipes/pipes.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { OtpDialogComponent } from 'src/app/components/otp-dialog/otp-dialog.component';

@NgModule({
  declarations: [
    UpgradeProfileComponent,
    CountryCodeDropdownComponent,
    OtpPageComponent,
    OtpDialogComponent,
    ProfileAvatarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    ModalModule.forRoot(),
    CommonComponentsModule,
    // RouterModule.forChild([
    //   {
    //     path: '', component: UpgradeProfileComponent
    //   }
    // ])
  ],
  exports: [
    UpgradeProfileComponent
  ],
  entryComponents: [
    OtpDialogComponent
  ]
})
export class UpgradeProfileModule { }
