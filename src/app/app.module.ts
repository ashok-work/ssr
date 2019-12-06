import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// import { HomepageComponent } from "./homepage/homepage.component";
// import { SearchBarComponent } from "./search-bar/search-bar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
// import { SpacesComponent } from "./spaces/spaces.component";
// import { GuestsDialogComponent } from "./spaces/dialogs/guests-dialog.component";
// import { SizeDialogComponent } from "./spaces/dialogs/size-dialog.component";
// import { PriceDialogComponent } from "./spaces/dialogs/price-dialog.component";
import { UtilsService } from "./services/utils/utils.service";
import { CookieDataService } from "./services/cookie-service/cookie.service";
// import { CookieService } from "ngx-cookie-service";
import { CommonService } from "./services/common-service/common.service";
import { NotificationsService } from "angular2-notifications";
import { AuthService } from "./services/auth/auth.service";
import { ConfigService } from "./services/config/config.service";
// import { ImageSliderComponent } from "./spaces/image-slider/image-slider.component";
// import { ImageSliderDirective } from "./directive/image-slider.directive";
// import { AddSpaceComponent } from "./add-space/add-space.component";
// import { MySpacesComponent } from "./my-spaces/my-spaces.component";
import { SidenavModule } from "./modules/sidenav/sidenav.module";
import { LayoutModule } from "@angular/cdk/layout";
import { OverlayModule } from "@angular/cdk/overlay";
// import { SpaceDetailsComponent } from "./space-details/space-details.component";
// import { StartRatingComponent } from "./space-details/start-rating/start-rating.component";
// import { CoverPhotosComponent } from "./space-details/cover-photos/cover-photos.component";
// import { CoverPhotosDialogComponent } from "./space-details/cover-photos/cover-photos-dialog.component";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
// import { ModalModule } from "ngx-bootstrap";
import { CustomFormsModule } from "ngx-custom-validators";
// import { SideImageComponent } from "./ignore/side-image/side-image.component";
// import { PrivacyComponent } from "./about-us/privacy/privacy.component";
// import { TermsComponent } from "./about-us/terms/terms.component";
// import { AboutUsComponent } from "./about-us/about-us/about-us.component";
import { IonicModule } from "@ionic/angular";
// import { PlanEventComponent } from "./space-details/plan-event/plan-event.component";
import { Maps } from "./services/maps/maps";
// import { PreviewComponent } from "./booking/preview/preview.component";
// import { PreviewCardComponent } from "./booking/preview-card/preview-card.component";
// import { GuestAcknowledgeComponent } from "./booking/guest-acknowledge/guest-acknowledge.component";
// import { MyBookingsComponent } from "./space-details/my-bookings/my-bookings.component";
// import { MakePaymentComponent } from "./booking/make-payment/make-payment.component";
//import { UserBookingsComponent } from "./user-bookings/user-bookings.component";
// import { StripePaymentComponent } from "./booking/make-payment/stripe-payment/stripe-payment.component";
// import { CancelDialogComponent } from "./user-bookings/cancel-dialog.component";
// import { DescDialogComponent } from "./user-bookings/desc-dialog.component";
// import { BsDropdownModule } from "ngx-bootstrap";
// import { MultisearchBarComponent } from "./multisearch-bar/multisearch-bar.component";
// import { UserModule } from "./user-module/user-module";
// import { NgxDaterangepickerMd } from "./daterangepicker/daterangepicker.module";
// import { ShareButtonsModule } from "@ngx-share/buttons";
// import { ShareButtonModule } from "@ngx-share/button";
// import { CarouselModule } from "ngx-bootstrap/carousel";
// import { AwsUploadImgComponent } from "./ignore/create-space/aws-upload-img/aws-upload-img.component";
import { AwsS3Service } from "./services/aws-s3/aws-s3.service";
// import { AllEventsComponent } from './all-events/all-events.component';
// import { ActivitiesComponent } from './add-space/activities/activities.component';
// import { AminitiesSelectionComponent } from './add-space/aminities-selection/aminities-selection.component';
// import { SpaceRulesComponent } from './add-space/space-rules/space-rules.component';
// import { SpaceAccesibilityComponent } from './add-space/space-accesibility/space-accesibility.component';
// import { WishlistComponent } from './wishlist/wishlist.component';
// import { WishlistDialogComponent } from './wishlist/wishlist-dialog.component';
// import { FirstSectionComponent } from "./add-space/first-section/first-section.component";
// import { AboutSpaceComponent } from "./add-space/about-space/about-space.component";
// import { SetTheSceneComponent } from "./add-space/set-the-scene/set-the-scene.component";
// import { SetForGuestsComponent } from "./add-space/set-for-guests/set-for-guests.component";
// import { CreateSpaceModule } from "./create-space/create-space.module";
//import { BarRatingModule } from "ngx-bar-rating";
// import { TooltipModule } from "ngx-bootstrap/tooltip";
// import { PaginationModule } from "ngx-bootstrap/pagination";
// import { NewSpaceComponent } from './new-space/new-space.component';
// import { MapComponent } from "./directive/map-directive/map-directive.component";
import { CalendarComponent } from './components/calendar/calendar.component';
// import { UpgradeProfileComponent } from './upgrade-profile/upgrade-profile.component';
// import { OccasionFilterPipe } from './pipes/occasion.filter.pipe';
// import { BrandFilterPipe } from './pipes/brand.filter.pipe';
// import { CurrencyFilterPipe } from './pipes/currency.filter.pipe';
// import { EventDatePipe } from './pipes/event-date.pipe'
// import { EventTypeFilterPipe } from './pipes/event.type.filter.pipe';
// import { PhoneFormatPipe } from './pipes/phone-format.pipe';
// import { CountryCodeDropdownComponent } from './country-code-dropdown/country-code-dropdown.component';
// import { OtpPageComponent } from './otp-page/otp-page.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { UserGuard } from './guards/user/user.guard';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { CookieModule } from 'ngx-cookie';
import { LazyLoadImageModule } from 'ng-lazyload-image';

const config: SocketIoConfig = { url: environment['socket_url'], options: {} };

@NgModule({
  declarations: [
    AppComponent,
    // HomepageComponent,
    // SearchBarComponent,
    // SpacesComponent,
    // GuestsDialogComponent,
    // SizeDialogComponent,
    // PriceDialogComponent,
    // ImageSliderComponent,
    // ImageSliderDirective,
    // AddSpaceComponent,
    // MySpacesComponent,
    // SpaceDetailsComponent,
    // StartRatingComponent,
    // CoverPhotosComponent,
    // CoverPhotosDialogComponent,
    // SideImageComponent,
    // PrivacyComponent,
    // TermsComponent,
    // AboutUsComponent,
    // PlanEventComponent,
    // PreviewComponent,
    // PreviewCardComponent,
    // GuestAcknowledgeComponent,
    // MyBookingsComponent,
    // MakePaymentComponent,
    //UserBookingsComponent,
    // StripePaymentComponent,
    //CancelDialogComponent,
    // DescDialogComponent,
    // MultisearchBarComponent,
    // AwsUploadImgComponent,
    // AllEventsComponent,
    // ActivitiesComponent,
    // AminitiesSelectionComponent,
    // SpaceRulesComponent,
    // SpaceAccesibilityComponent,
    // WishlistComponent,
    // WishlistDialogComponent,
    // FirstSectionComponent,
    // AboutSpaceComponent,
    // SetTheSceneComponent,
    // SetForGuestsComponent,
    // NewSpaceComponent,
    // MapComponent,
    CalendarComponent,
    // UpgradeProfileComponent,
    // OccasionFilterPipe,
    // BrandFilterPipe,
    // CurrencyFilterPipe,
    // EventDatePipe,
    // EventTypeFilterPipe,
    // PhoneFormatPipe,
    // CountryCodeDropdownComponent,
    // OtpPageComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutModule,
    OverlayModule,
    NgxMaterialTimepickerModule,
    // ModalModule.forRoot(),
    CustomFormsModule,
    ReactiveFormsModule,
    IonicModule,
    // GooglePlaceModule,
    // BsDropdownModule.forRoot(),
    // UserModule,
    SidenavModule,
    // BsDatepickerModule.forRoot(),
    //NgxDaterangepickerMd.forRoot(),
    // ShareButtonsModule,
    // ShareButtonModule,
    // CarouselModule.forRoot(),
    // CreateSpaceModule,
    //BarRatingModule,
    // TooltipModule.forRoot(),
    // PaginationModule.forRoot(),
    SocketIoModule.forRoot(config),
    CookieModule.forRoot(),
    LazyLoadImageModule,
  ],
  providers: [
    UtilsService,
    CookieDataService,
    NotificationsService,
    // CookieService,
    CommonService,
    AuthService,
    ConfigService,
    Maps,
    AwsS3Service,
    AuthGuard,
    UserGuard
  ],
  entryComponents: [
    // GuestsDialogComponent,
    // SizeDialogComponent,
    // PriceDialogComponent,
    //CancelDialogComponent,
    //DescDialogComponent,
    // CoverPhotosDialogComponent,
    // WishlistDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }