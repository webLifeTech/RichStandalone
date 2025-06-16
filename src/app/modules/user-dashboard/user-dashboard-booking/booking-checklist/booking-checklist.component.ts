import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from '../../../../shared/services/toast.service';
import { BookingService } from '../../../../shared/services/booking.service';
import { GlobalService } from '../../../../shared/services/global.service';

@Component({
  selector: 'app-booking-checklist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './booking-checklist.component.html',
  styleUrl: './booking-checklist.component.scss'
})
export class BookingChecklistComponent {

  @Input() bookingRefNo: any = "";
  type: string;

  cancellationForm: FormGroup;
  submitted: boolean = false;

  // vehicle-checklist.data.ts
  checklist = [
    { "satisfactory": false, "defective": false, "na": false, description: 'Condition & function of seatbelts' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Head restraint adjustment' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Mirror adjustment' },
    { "satisfactory": false, "defective": false, "na": false, description: 'First AID kit' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Fire extinguisher' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Torch' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Warning triangle' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Vehicle handbook' },
    { "satisfactory": false, "defective": false, "na": false, description: 'All lights' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Horn' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Washers and wipers' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Brake' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Fuel' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Engine oil level' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Coolant level' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Wind screen wash level' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Brake/clutch fluid' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Condition of battery' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Oil or waste leaks' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Condition of windscreen' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Cleanness of windscreen windows' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Security of load, trailer, roofrack' },
    { "satisfactory": false, "defective": false, "na": false, description: 'Condition of tyres' },
  ];


  constructor(
    // private modalService: NgbModal,
    // public activeModal: NgbActiveModal,
    public bf: FormBuilder,
    private toast: ToastService,
    public gs: GlobalService,
    private bookingService: BookingService,
  ) {
    this.cancellationForm = this.bf.group({
      // "userId": this.providerDetails.userId,
      "reason": [null, Validators.required],
      "remarks": ["", Validators.required],
    })
  }

  ngOnInit() {
  }

  get cancelFormControl(): any {
    return this.cancellationForm.controls;
  }

  onChangeCheck(row: any, slctValue: any) {
    console.log("satisfactory >>>>>", row["satisfactory"]);
    console.log("defective >>>>>", row["defective"]);
    console.log("na >>>>>", row["na"]);

    if (slctValue === "satisfactory" && row[slctValue]) {
      row["defective"] = !row["satisfactory"];
      row["na"] = !row["satisfactory"];
    }
    if (slctValue === "defective" && row[slctValue]) {
      row["satisfactory"] = !row["defective"];
      row["na"] = !row["defective"];
    }
    if (slctValue === "na" && row[slctValue]) {
      row["satisfactory"] = !row["na"];
      row["defective"] = !row["na"];
    }
    // for (let [key, value] of Object.entries(row)) {
    //   console.log("key >>>>>>", key);
    //   if (key !== slctValue) {
    //     row[key] = !row[slctValue];
    //   }
    // }
    // row.map((obj: any) => {
    //   console.log("obj >>>>>>>", obj);

    //   if (obj[slctValue] && obj !== slctValue) {
    //     return { ...obj, emp_name: "rahul" };
    //   }
    // });
  }

  onSubmit() {
    this.submitted = true;
    if (this.cancellationForm.valid) {
      // this.activeModal.close({ confirmed: true, reason: this.reason });
      this.toast.successToastr("Booking Cancelled Successfully")
    } else {
      this.toast.errorToastr("Please fill the all required fields.")
    }
  }

}
