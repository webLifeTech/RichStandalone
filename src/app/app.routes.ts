import { Routes } from '@angular/router';
import { Layout1Component } from './shared/layout/layout-1/layout-1.component';
import { CabHomeComponent } from './modules/home/cab-home/cab-home.component';
import { LogInComponent } from './modules/auth/log-in/log-in.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { CabListLeftSidebarComponent } from './modules/cab/listing/list-view/cab-list-left-sidebar/cab-list-left-sidebar.component';
import { Layout2Component } from './shared/layout/layout-2/layout-2.component';
import { UserDashboardComponent } from './modules/user-dashboard/user-dashboard.component';
import { CabBookingComponent } from './modules/cab/booking/cab-booking/cab-booking.component';
// import { CabBookingPaymentComponent } from './modules/cab/booking/cab-booking-payment/cab-booking-payment.component';
import { CabBookingSuccessComponent } from './modules/cab/booking/cab-booking-success/cab-booking-success.component';
import { CabBookingFailedComponent } from './modules/cab/booking/cab-booking-failed/cab-booking-failed.component';
import { Layout3Component } from './shared/layout/layout-3/layout-3.component';
import { VendorsComponent } from './modules/vendor/vendors/vendors.component';
import { UserDashboardKycComponent } from './modules/user-dashboard/user-dashboard-kyc/user-dashboard-kyc.component';
import { UserDashboardBookingComponent } from './modules/user-dashboard/user-dashboard-booking/user-dashboard-booking.component';
import { UserDashboardPaymentsComponent } from './modules/user-dashboard/user-dashboard-payments/user-dashboard-payments.component';
import { UserWalletComponent } from './modules/user-dashboard/user-wallet/user-wallet.component';
import { UserWishlistComponent } from './modules/user-dashboard/user-wishlist/user-wishlist.component';
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
import { ServicesComponent } from './modules/services/services.component';
import { EnquiriesComponent } from './modules/vendor/enquiries/enquiries.component';
import { UserMasterConfigurationComponent } from './modules/user-dashboard/user-master-configuration/user-master-configuration.component';
import { UserRecentActivityComponent } from './modules/user-dashboard/user-recent-activity/user-recent-activity.component';
import { NotificationViewComponent } from './shared/components/header/widgets/notification-view/notification-view.component';
import { AdminMyProfileComponent } from './modules/admin-dashboard/admin-my-profile/admin-my-profile.component';
import { ServiceDetailsComponent } from './modules/services/service-details/service-details.component';
import { ForgotPasswordComponent } from './modules/auth/forgot-password/forgot-password.component';
import { UserVehicleRiskRatingComponent } from './modules/user-dashboard/user-vehicle-risk-rating/user-vehicle-risk-rating.component';
import { UserDocumentsComponent } from './modules/user-dashboard/user-documents/user-documents.component';
import { UsersApprovalKycComponent } from './modules/user-dashboard/users-approval-kyc/users-approval-kyc.component';

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
    path: 'services',
    component: LayoutHeadFootComponent, children: [
      {
        path: '',
        component: ServicesComponent
      },
      {
        path: 'details',
        component: ServiceDetailsComponent
      },
    ]
  },
  {
    path: 'all-notification', component: LayoutHeadFootComponent, children: [
      { path: '', component: NotificationViewComponent },
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
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
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
        path: 'hire-drivers',
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
            path: 'booking/:vehicleId/:summaryId', // cab or driver both id
            component: CabBookingComponent
          },
          // {
          //   path: 'booking-payment/:vehicleId/:summaryId', // cab or driver both id
          //   component: CabBookingPaymentComponent
          // },
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
        path: 'booking',
        component: UserDashboardBookingComponent
      },
      {
        path: 'wallet',
        component: UserWalletComponent
      },
      {
        path: 'favourite',
        component: UserWishlistComponent
      },
      {
        path: 'payments',
        component: UserDashboardPaymentsComponent
      },
      {
        path: 'reviews',
        component: UserReviewsComponent
      },
      {
        path: 'profile',
        component: UserDashboardKycComponent,
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: 'my-cars',
        component: MyCarsComponent
      },
      {
        path: 'recent-activity',
        component: UserRecentActivityComponent
      },
      {
        path: 'setting',
        component: UserSettingsComponent
      },
      {
        path: 'document',
        component: UserDocumentsComponent
      },
      {
        path: 'enquiries',
        component: EnquiriesComponent
      },
      {
        path: 'vehicle-risk-rating',
        component: UserVehicleRiskRatingComponent
      },

      { // admin
        path: 'bookingOverview',
        component: AllBookingOverviewComponent
      },
      { // admin
        path: 'alluser', // path: 'user-listing',
        component: UsersListingComponent
      },
      { // admin
        path: 'allVehicles', // path: 'user-vehicles',
        component: UserCarsListingComponent
      },
      {
        path: 'configuration', // 'master-configuration/:payckageStatus'
        component: UserMasterConfigurationComponent, children: [
          {
            path: 'security',
            component: SecurityComponent
          }
        ]
      },
      {
        path: 'approval',
        component: UsersApprovalKycComponent
      },
    ]
  },
  {
    path: 'vendor',
    component: Layout3Component, children: [
      {
        path: 'dashboard',
        component: VendorsComponent
      },
      {
        path: 'enquiries',
        component: EnquiriesComponent
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
        component: AdminMyProfileComponent,
      },
      {
        path: 'my-cars',
        component: MyCarsComponent
      },
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
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
];
