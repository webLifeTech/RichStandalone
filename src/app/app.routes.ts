import { Routes } from '@angular/router';
import { Layout1Component } from './shared/layout/layout-1/layout-1.component';
import { CabHomeComponent } from './modules/home/cab-home/cab-home.component';
import { LogInComponent } from './modules/auth/log-in/log-in.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { CabListLeftSidebarComponent } from './modules/cab/listing/list-view/cab-list-left-sidebar/cab-list-left-sidebar.component';
import { Layout2Component } from './shared/layout/layout-2/layout-2.component';
import { UserDashboardComponent } from './modules/user-dashboard/user-dashboard.component';
import { CabBookingComponent } from './modules/cab/booking/cab-booking/cab-booking.component';
import { CabBookingPaymentComponent } from './modules/cab/booking/cab-booking-payment/cab-booking-payment.component';
import { CabBookingSuccessComponent } from './modules/cab/booking/cab-booking-success/cab-booking-success.component';
import { CabBookingFailedComponent } from './modules/cab/booking/cab-booking-failed/cab-booking-failed.component';
import { Layout3Component } from './shared/layout/layout-3/layout-3.component';
import { VendorsComponent } from './modules/vendor/vendors/vendors.component';
import { UserDashboardKycComponent } from './modules/user-dashboard/user-dashboard-kyc/user-dashboard-kyc.component';
import { UserDashboardBookingComponent } from './modules/user-dashboard/user-dashboard-booking/user-dashboard-booking.component';
import { UserDashboardPaymentsComponent } from './modules/user-dashboard/user-dashboard-payments/user-dashboard-payments.component';
import { UserWalletComponent } from './modules/user-dashboard/user-wallet/user-wallet.component';
import { UserWishlistComponent } from './modules/user-dashboard/user-wishlist/user-wishlist.component';
import { VendorLayoutComponent } from './shared/layout/vendor-layout/vendor-layout.component';
import { PricingComponent } from './modules/other/pricing/pricing.component';
import { LayoutHeadFootComponent } from './shared/layout/layout-head-foot/layout-head-foot.component';
import { PlanSubscribeComponent } from './modules/other/pricing/plan-subscribe/plan-subscribe.component';
import { PaymentSuccessComponent } from './shared/components/comman/payment-success/payment-success.component';
import { UserReviewsComponent } from './modules/user-dashboard/user-reviews/user-reviews.component';
import { UserSettingsComponent } from './modules/user-dashboard/user-settings/user-settings.component';
import { SecurityComponent } from './modules/user-dashboard/user-settings/security/security.component';
import { PreferencesComponent } from './modules/user-dashboard/user-settings/preferences/preferences.component';
import { NotificationsComponent } from './modules/user-dashboard/user-settings/notifications/notifications.component';
import { MyCarsComponent } from './modules/user-dashboard/user-my-cars/my-cars.component';
import { AdminDashboardComponent } from './modules/admin-dashboard/admin-dashboard.component';
import { UserCarsListingComponent } from './modules/admin-dashboard/user-cars-listing/user-cars-listing.component';
import { UsersListingComponent } from './modules/admin-dashboard/users-listing/users-listing.component';
import { AllBookingOverviewComponent } from './modules/admin-dashboard/all-booking-overview/all-booking-overview.component';
import { CanDeactivateGuard } from './shared/guards/can-deactivate.guard';

export const routes: Routes = [
  {
    path: 'home', component: Layout1Component, children: [
      { path: '', component: CabHomeComponent },
    ]
  },
  {
    path: 'pricing', component: LayoutHeadFootComponent, children: [
      { path: '', component: PricingComponent },
      { path: 'package-subscribe/:packageFor/:packageId', component: PlanSubscribeComponent },
      { path: 'payment-success', component: PaymentSuccessComponent },
    ]
  },
  {
    path: 'auth', component: Layout1Component, children: [
      {
        path: 'log-in',
        component: LogInComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
    ]
  },
  {
    path: 'cab', component: Layout2Component, children: [
      {
        path: 'listing',
        children: [
          {
            path: 'list-view',
            component: CabListLeftSidebarComponent
          },
        ],
      },
      {
        path: 'booking',
        children: [
          {
            path: 'booking/:id', // cab or driver both id
            component: CabBookingComponent
          },
          {
            path: 'booking-payment/:id', // cab or driver both id
            component: CabBookingPaymentComponent
          },
          {
            path: 'booking-success/:type',
            component: CabBookingSuccessComponent
          },
          {
            path: 'booking-failed/:id',
            component: CabBookingFailedComponent
          }
        ]
      },
      {
        path: 'single-details',
        children: [
          {
            path: 'list-view',
            component: CabListLeftSidebarComponent
          },
        ]
      },
    ]
  },
  {
    path: 'user', component: Layout3Component, children: [
      {
        path: 'dashboard',
        component: UserDashboardComponent
      },
      {
        path: 'my-bookings',
        component: UserDashboardBookingComponent
      },
      {
        path: 'my-wallet',
        component: UserWalletComponent
      },
      {
        path: 'favourite',
        component: UserWishlistComponent
      },
      {
        path: 'my-payments',
        component: UserDashboardPaymentsComponent
      },
      {
        path: 'reviews',
        component: UserReviewsComponent
      },
      {
        path: 'my-profile',
        component: UserDashboardKycComponent,
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: 'my-cars',
        component: MyCarsComponent
      },
      // SecurityComponent
      // PreferencesComponent
      // NotificationsComponent
      {
        path: 'settings',
        component: UserSettingsComponent, children: [
          {
            path: 'security',
            component: SecurityComponent
          },
          {
            path: 'preferences',
            component: PreferencesComponent
          },
          {
            path: 'notifications',
            component: NotificationsComponent
          },
        ]
      },
    ]
  },
  {
    path: 'admin', component: Layout3Component, children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'user-listing',
        component: UsersListingComponent
      },
      {
        path: 'user-vehicles',
        component: UserCarsListingComponent
      },
      {
        path: 'booking-overview',
        component: AllBookingOverviewComponent
      },
      {
        path: 'my-bookings',
        component: UserDashboardBookingComponent
      },
      {
        path: 'my-wallet',
        component: UserWalletComponent
      },
      {
        path: 'favourite',
        component: UserWishlistComponent
      },
      {
        path: 'my-payments',
        component: UserDashboardPaymentsComponent
      },
      {
        path: 'reviews',
        component: UserReviewsComponent
      },
      {
        path: 'my-profile',
        component: UserDashboardKycComponent
      },
      {
        path: 'my-cars',
        component: MyCarsComponent
      },
      // SecurityComponent
      // PreferencesComponent
      // NotificationsComponent
      {
        path: 'settings',
        component: UserSettingsComponent, children: [
          {
            path: 'security',
            component: SecurityComponent
          },
          {
            path: 'preferences',
            component: PreferencesComponent
          },
          {
            path: 'notifications',
            component: NotificationsComponent
          },
        ]
      },
    ]
  },
  {
    path: 'vendor',
    component: VendorLayoutComponent, children: [
      {
        path: 'dashboard',
        component: VendorsComponent
      },
    ]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
];
