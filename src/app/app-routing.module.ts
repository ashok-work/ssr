import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { UserGuard } from './guards/user/user.guard';
import { PaymentGuard } from './guards/payment/payment.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: "./modules/homepage/homepage.module#HomepageModule"
  },
  {
    path: 'host',
    loadChildren: "./modules/host-landing/host-landing.module#HostLandingModule"
  },
  {
    path: 'event-planning',
    loadChildren: "./modules/event-planning/event-planning.module#EventPlanningModule"
  },
  {
    path: 'chat',
    loadChildren: "./modules/chat/chat.module#ChatModule",
    canActivate: [AuthGuard]
  },
  // {
  //   path: "acknowledge-guest", component: GuestAcknowledgeComponent
  // },
  // {
  //   path: "payment",
  //   loadChildren: "./booking/make-payment/make-payment.module#MakePaymentModule"
  // },
  {
    path: "my-bookings",
    loadChildren: "./modules/user-bookings/user-bookings.module#UserBookingsModule",
    canActivate: [AuthGuard]
  },
  {
    path: "booking-preview",
    loadChildren: "./modules/preview/preview.module#PreviewModule",
    canActivate: [AuthGuard, PaymentGuard]
  },
  {
    path: 'privacy',
    loadChildren: "./modules/privacy/privacy.module#PrivacyModule"
  },
  {
    path: 'terms',
    loadChildren: "./modules/terms/terms.module#TermsModule"
  },
  {
    path: 'about-us',
    loadChildren: "./modules/about-us/about-us.module#AboutUsModule"
  },
  {
    path: 'faqs',
    loadChildren: "./modules/faqs/faqs.module#FaqsModule"
  },
  {
    path: 'support',
    loadChildren: "./modules/support/support.module#SupportModule"
  },
  // {
  //   path: 'spaces/:placeId', component: SpacesComponent
  // },

  {
    path: 'my-spaces',
    loadChildren: "./modules/my-spaces/my-spaces.module#MySpacesModule",
    canActivate: [AuthGuard]
  },
  {
    path: 'add-menu',
    loadChildren: "./modules/add-menu/add-menu.module#AddMenuModule",
    canActivate: [AuthGuard]
  },
  {
    path: 'booking-menu',
    loadChildren: "./modules/booking-menu/booking-menu.module#BookingMenuModule",
    canActivate: [AuthGuard]
  },
  {
    path: 'operating-hours',
    loadChildren: "./modules/operating-hours/operating-hours.module#OperatingHoursModule",
    canActivate: [AuthGuard]
  },
  {
    path: 'update-info',
    loadChildren: "./modules/update-info/update-info.module#UpdateInfoModule",
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'spaces/:searchString', component: SpacesComponent
  // },
  // {
  //   path: 'spaces',
  //   loadChildren: "./spaces/spaces.module#SpacesModule"
  // },
  {
    path: 'details/:spaceId',
    loadChildren: "./modules/space-details/space-details.module#SpaceDetailsModule",
    // canActivate: [AuthGuard]
  },
  {
    path: 'booking/:bookingId',
    loadChildren: "./modules/space-details/space-details.module#SpaceDetailsModule",
    canActivate: [AuthGuard]
  },
  {
    path: 'host/booking/:hostBookingId',
    loadChildren: "./modules/space-details/space-details.module#SpaceDetailsModule",
    canActivate: [AuthGuard]
  },
  {
    path: "all-events",
    loadChildren: './modules/all-events/all-events.module#AllEventsModule'
  },
  // {
  //   path: 'add-photos', component: AwsUploadImgComponent
  // },
  // {
  //   path: 'add-space-progress', component: AddSpaceComponent
  // },
  // {
  //   path: 'add-space-basics', component: FirstSectionComponent
  // },
  // {
  //   path: 'add-about-space', component: AboutSpaceComponent
  // },
  // {
  //   path: 'space-aminities', component: AminitiesSelectionComponent
  // },
  // {
  //   path: 'space-accessibility', component: SpaceAccesibilityComponent
  // },
  // {
  //   path: 'space-rules', component: SpaceRulesComponent
  // },
  // {
  //   path: 'space-activities', component: ActivitiesComponent
  // },
  // {
  //   path: 'set-the-scene', component: SetTheSceneComponent
  // },
  // {
  //   path: 'add-guest-details', component: SetForGuestsComponent
  // },
  {
    path: 'saved',
    loadChildren: "./modules/wishlist/wishlist.module#WishlistModule",
    canActivate: [AuthGuard]
  },
  {
    path: 'create-space-step1',
    loadChildren: "./modules/new-space/new-space.module#NewSpaceModule",
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'profile',
  //   loadChildren: "./upgrade-profile/upgrade-profile.module#UpgradeProfileModule",
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'booking-requests',
    loadChildren: "./modules/booking-requests/booking-requests.module#BookingRequestsModule",
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'transaction-history',
  //   loadChildren: "./transaction-history/transaction-history.module#TransactionHistoryModule",
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'payout-preferences',
  //   loadChildren: "./payout-preferences/payout-preferences.module#PayoutPreferencesModule",
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'account',
    loadChildren: "./modules/account/account.module#AccountModule",
    canActivate: [AuthGuard]
  },
  {
    path: '*',
    redirectTo: '',
    pathMatch: 'full',
  }
  // {
  //   path: 'calendar', component: CalendarComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
