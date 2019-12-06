import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { MagiclinkComponent } from './magiclink/magiclink.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { FooterComponent } from './footer/footer.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UserGuard } from '../../guards/user/user.guard';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [
    LandingComponent,
    LoginComponent,
    MagiclinkComponent,
    FooterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    CommonComponentsModule,
    MaterialModule,
    RouterModule.forRoot([
      {
        path: 'login', component: LoginComponent,
        canActivate: [UserGuard]
      },
      {
        path: 'welcome', component: LandingComponent,
        canActivate: [UserGuard]
      },
      {
        path: 'magiclink', component: MagiclinkComponent,
        canActivate: [UserGuard]
      },
      {
        path: 'magiclink/:token', component: MagiclinkComponent,
        canActivate: [UserGuard]
      },
      {
        path: 'forgot-password', component: ForgotPasswordComponent,
        // canActivate: [UserGuard]
      },
      {
        path: 'reset-password/:token', component: ResetPasswordComponent,
        canActivate: [UserGuard]
      }
    ])
  ],
  exports: [
    LandingComponent,
    LoginComponent,
    MagiclinkComponent,
    FooterComponent,
    ForgotPasswordComponent,
    AppRoutingModule,
  ]
})
export class UserModule { }
