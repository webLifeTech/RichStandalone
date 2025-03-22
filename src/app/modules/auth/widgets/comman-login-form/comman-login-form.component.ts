import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';
import { AuthService } from '../../../../shared/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from '../../../../shared/services/toast.service';
import { GlobalService } from '../../../../shared/services/global.service';

@Component({
  selector: 'app-comman-login-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    TranslateModule
  ],
  templateUrl: './comman-login-form.component.html',
  styleUrl: './comman-login-form.component.scss'
})
export class CommanLoginFormComponent {

  params: any = {};
  isVendor: any = false;
  loginForm: any = {
    name: "",
    username: "",
    password: ""
  };
  registerForm: any = {
    vendor_type: null,
    type: null,
  };

  @Input() type: string;
  enterOTP: boolean = false;
  sentotp: boolean = false;
  timer: number = 0;

  vendorTypes: any = [
    { id: 1, name: "Attorney", value: "Attorney" },
    { id: 2, name: "Mortgage brokers", value: "Mortgage brokers" },
    { id: 3, name: "Insurance Agent", value: "Insurance Agent" },
    { id: 4, name: "Vehicle Inspections", value: "Vehicle Inspections" },
    { id: 5, name: "Others", value: "Others" },
  ];

  iAmArray: any = [
    { id: 1, name: "Driver", value: "Driver" },
    { id: 2, name: "Fleet owner", value: "Fleet owner" },
    { id: 3, name: "Individual car owner", value: "Individual car owner" },
    { id: 4, name: "Driver with owned car", value: "Driver with owned car" }
  ];

  users: any = [
    {
      "name": "Driver",
      "username": "driver@gmail.com",
      "password": "123123",
      "role": "user",
      "userRoleName": "Driver",
      "roleName": "53D8CF61-E99B-43A9-AA8F-4CE5B0E12872",

      // New york (Driver User)
      "userId": "99ea64c3-17b4-4bb4-bcbc-c9ed65708ff5",
      "contactId": 1001,

      // New york city (Driver User)
      // "userId": "bd485943-ece2-4d67-85a4-113fd36f3908",
      // "contactId": 10020,

      // Other (Driver User)
      // "userId": "f408b99f-6ec4-4603-b89d-be8fb828238e",
      // "contactId": 10029,
      "id": 1
    },
    {
      "name": "Individualcarowner",
      "username": "individualcarowner@gmail.com",
      "password": "123123",
      "role": "user_2",
      "userRoleName": "Individual car owner",
      "roleName": "E56F8C18-B4F6-4EE4-976D-A693AA6F98FF",

      // New york (Individualcarowner User)
      // "userId": "dce35052-51e8-4091-bada-b1d7108d6bf8",
      // "contactId": 10023,

      // New york city (Individualcarowner User)
      "userId": "f438ebd8-a2d3-4cc6-addf-2d29aff084d7",
      "contactId": 10040,

      // Other (Individualcarowner User)
      // "userId": "31f77d5b-5749-44dc-9e16-6d0140bf86dd",
      // "contactId": 301,

      "id": 2
    },
    {
      "name": "Fleetowner",
      "username": "fleetowner@gmail.com",
      "password": "123123",
      "role": "user_3",
      "userRoleName": "Fleet owner",
      "roleName": "B5107AB1-19BF-430B-9553-76F39DB1CDCD",

      // New york (Fleetowner User)
      // "userId": "2991e709-4966-4b64-beb4-4e9ff34f4a4f",
      // "contactId": 10066,

      // New york city (Fleetowner User)
      "userId": "5901c8d4-6a9b-400e-b063-fa2d217b2af5",
      "contactId": 10081,

      // Other (Fleetowner User)
      // "userId": "f7cce929-b2bf-422c-9383-35480e468ff0",
      // "contactId": 10025,
      "id": 3
    },
    {
      "name": "Driverwithownedcar",
      "username": "driverwithownedcar@gmail.com",
      "password": "123123",
      "role": "user_4",
      "userRoleName": "Individual car owner",
      "roleName": "416D4E0F-32BB-4218-B2EA-499764D5F62E",

      // New york (Driverwithownedcar User 1)
      "userId": "d837179a-44cd-4fec-b45e-bb16bf572966",
      "contactId": 297,

      // New york city (Driverwithownedcar User 1)
      // "userId": "fbe52ab4-3bf2-4131-9265-1f8fb6a1d152",
      // "contactId": 1002,

      // Other (Driverwithownedcar User 1)
      // "userId": "00a25198-7a94-4265-9ae1-2446c7928fb3",
      // "contactId": 304,
      "id": 4
    }
  ]

  constructor(
    private router: Router,
    private authService: AuthService,
    private gs: GlobalService,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {
    this.route.queryParams.subscribe((pera: any) => {
      this.params = pera;
      if (pera && pera.type === "vendor") {
        this.isVendor = true;
      }
    })
  }

  userAuth(type: string) {
    if (type == 'login') {
      this.router.navigate(['/auth/register'], {
        queryParams: this.params
      });
    }
    else {
      if (this.isVendor) {
        this.router.navigateByUrl('/vendor/dashboard');
      } {
        this.router.navigateByUrl('/auth/log-in');
      }
    }
  }

  authUser(frm: any, type: string) {
    if (this.loginForm.username === 'admin@gmail.com') {
      this.loginForm.role = 'admin';
      this.loginForm.name = 'Admin';
      this.loginForm.id = 100;
    } else {
      this.gs.isSpinnerShow = true;
      this.authService.userLogin(this.loginForm).subscribe((res: any) => {
        console.log("res >>>>>>>", res);
        this.gs.isSpinnerShow = false;
        let roles: any = {
          ["Driver"]: "user",
          ["Individual car owner"]: "user_2",
          ["Fleet owner"]: "user_3",
          ["Driver with owned car"]: "user_4",
        }

        this.loginForm = {
          "name": res.fullName,
          "username": this.loginForm.username,
          "password": this.loginForm.password,
          "role": roles[res.roleName],
          "userRoleName": res.roleName, // "Fleet owner",
          "roleName": res.userType, // "B5107AB1-19BF-430B-9553-76F39DB1CDCD",
          "userId": res.userID, // "5901c8d4-6a9b-400e-b063-fa2d217b2af5",
          "contactId": res.personNum,
        };

        if (type == 'login') {
          this.authService.login(this.loginForm);
        }
        this.toast.successToastr("Logged in successfully");

      }, err => {
        console.log("Username or password not correct!");
        this.toast.errorToastr("Username or password not correct!");

      })
      // return;
      // const findUser = this.users.find((i: any) => i.username === this.loginForm.username);
      // if (findUser && findUser.id) {
      //   this.loginForm = findUser;
      // } else {
      //   this.loginForm.role = 'user';
      //   this.loginForm.name = 'Daniel Johshuva';
      //   this.loginForm.roleName = '53D8CF61-E99B-43A9-AA8F-4CE5B0E12872';
      //   this.loginForm.userRoleName = 'Driver';
      //   this.loginForm.userId = "99ea64c3-17b4-4bb4-bcbc-c9ed65708ff5"
      //   this.loginForm.id = 101;
      // }
    }

    // return;
    if (this.isVendor) {
      this.router.navigateByUrl('/vendor/dashboard');
      return;
    }
    if (type != 'login') {
      this.authService.register(this.loginForm)
    }
  }
  sendOtp() {
    this.enterOTP = true;
    this.sentotp = true;
    this.timer = 60; // Start the timer at 60 seconds

    const countdown = setInterval(() => {
      if (this.timer > 0) {
        this.timer--; // Decrease the timer by 1 second
      } else {
        clearInterval(countdown); // Stop the countdown when the timer reaches 0
        this.sentotp = false; // Optionally, hide the OTP input if the timer runs out
      }
    }, 1000);
  }

}
