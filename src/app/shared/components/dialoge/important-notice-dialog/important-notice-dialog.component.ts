import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CabService } from '../../../services/cab.service';
import { GlobalService } from '../../../services/global.service';
import { HtmlTextComponent } from '../../comman/html-text/html-text.component';


@Component({
  selector: 'app-important-notice-dialog',
  standalone: true,
  imports: [
    HtmlTextComponent,
    CommonModule,
    MatExpansionModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
    // TranslateModule
  ],
  templateUrl: './important-notice-dialog.component.html',
  styleUrls: ['./important-notice-dialog.component.scss']
})
export class ImportantNoticeDialogComponent {
  sections = [
    {
      title: 'Important info',
      content: 'When you pick the car up, you will need: Passport or national ID card, Driving licence & Credit card'
    },
    {
      title: 'Full rental terms',
      content: '',
      "accordion": [
        {
          "title": "Included in the rental price",
          "sections": {
            "heading": "Insurance, Covers and Waivers",
            "content": [
              {
                "subheading": "Insurance Information",
                "details": [
                  {
                    "text": "Insurance information",
                  },
                  {
                    "text": "All rental cars must have Collision Damage Waiver (CDW) and Theft Protection (TP). Each policy will be either:"
                  },
                  {
                    "text": "included or"
                  },
                  {
                    "text": "purchasable from the rental company, or"
                  },
                  {
                    "text": "provided by another company (e.g. your credit card company)"
                  }
                ]
              },
              {
                "subheading": "Collision Damage Waiver (CDW)",
                "details": [
                  {
                    "text": "This rental includes Collision Damage Waiver with zero excess. This cover is only valid if you stick to the terms of the rental agreement. It only covers the car's bodywork. It doesn't cover charges (e.g. for towing or off-road time), or anything in the car (e.g. child seats, GPS devices or personal belongings), or damage caused by the negligence of anyone driving the car."
                  }
                ]
              },
              {
                "subheading": "Theft Cover",
                "details": [
                  {
                    "text": "This rental includes Theft Protection with zero excess: if the car is stolen, or damaged while someone is trying to steal it, you won’t pay anything at all towards the cost of replacing or repairing it. This cover is only valid if you stick to the terms of the rental agreement."
                  }
                ]
              },
              {
                "subheading": "Third-Party Liability (TPL)",
                "details": [
                  {
                    "text": "Covers the driver’s liability for any injuries and property damage that are included in the policy. It does not cover injuries to the driver or damage to the rental car. This cover is only valid if you stick to the terms of the rental agreement."
                  }
                ]
              },
              {
                "subheading": "Loss or Damage",
                "details": [
                  {
                    "text": "If the car is stolen, or seriously damaged, or damaged in an incident involving someone else, please contact the rental company and the police immediately. If you can't provide the necessary documents from the police, you'll be liable for the full cost of replacing/repairing the car."
                  },
                  {
                    "text": "The rental company is not liable for the loss of / theft of / damage to any belongings in the car, during or after the rental."
                  },
                  {
                    "text": "Damage to the car will be charged for by the car hire company after it is dropped off - and will incur a Damage Administration fee on top of the amount deducted from the excess."
                  },
                  {
                    "text": "Not included in the rental cover (CDW & TP): Loss of / theft of / damage to: keys, aerials, jack, safety triangles and vests, windscreen wipers, petrol cap, luggage covers, or any other fixed or mobile component of the car."
                  }
                ]
              },
              {
                "subheading": "Mileage / Kilometres",
                "details": [
                  {
                    "text": "Your rental includes unlimited free miles."
                  },
                  {
                    "text": "Changing the length of your rental can affect how many miles you can drive for free. It can also affect how much you will pay for each additional mile."
                  }
                ]
              }
            ]
          }
        },
        {
          "title": "Not included in the rental price",
          "sections": {
            "heading": "",
            "content": [
              {
                "subheading": "Local Charges",
                "details": [
                  {
                    "text": "This section shows charges that you’ll pay at the counter because of (a) where you're picking your car up, (b) who's driving, and (c) where you go during your rental. It doesn’t show other over-the-counter costs, such as charges for fuel, child seats or additional services."
                  }
                ]
              },
              {
                "subheading": "Local Charges",
                "details": [
                  {
                    "text": "This section shows charges that you’ll pay at the counter because of (a) where you're picking your car up, (b) who's driving, and (c) where you go during your rental. It doesn’t show other over-the-counter costs, such as charges for fuel, child seats or additional services."
                  }
                ]
              },
              {
                "subheading": "Fines",
                "details": [
                  {
                    "text": "You are responsible for any charges and fines, including tolls, congestion charges, speeding tickets and parking or traffic fines."
                  }
                ]
              },
              {
                "subheading": "Additional drivers",
                "details": [
                  {
                    "text": "The main driver (the person named on the booking) must be present when you pick the car up, and must be the one who pays anything charged at the counter. There may be a daily fee for additional drivers. The rental terms, including age-related restrictions and fees, apply to any additional drivers."
                  },
                  {
                    "text": "An additional driver fee will apply for any additional driver: $5.00 per day, including tax."
                  }
                ]
              },
              {
                "subheading": "Roadside assistance",
                "details": [
                  {
                    "text": "You may have to pay extra for any emergency roadside assistance that your rental company provides. When you pick your car up, please make sure you find out where the relevant paperwork is kept. In most cases, it’ll be in the glove box or attached to the sun visor."
                  }
                ]
              },
              {
                "subheading": "Additional Fees at Drop-off",
                "details": [
                  {
                    "text": "If you’ve incurred any charges, such as speeding tickets or unpaid congestion charges, the car hire company will try to contact you when the authorities ask them who was driving. This could be months after your rental – and you’ll have to pay the company’s administration fee as well as the original charge."
                  }
                ]
              }
            ]
          }
        },
        {
          "title": "What you need at Pick-up",
          "sections": {
            "heading": "Acceptable forms of payment",
            "content": [
              {
                "subheading": "Accepted Credit  Cards",
                "details": [
                  {
                    "text": "The main driver must be in possession of a Credit Card in their own name when picking up the car. The Card must have enough available funds to cover the excess / deposit amount (which will be blocked on the Card for the duration of the rental). The Card will also be required to pay for local fees, extra equipment and anything purchased additionally at the car hire counter."
                  }
                ]
              },
              {
                "subheading": "Rules around  payment cards",
                "details": [
                  {
                    "text": "Cards distributed by neobanks (online-only banks) are not accepted.",
                  },
                  {
                    "text": "If you pay by credit card, your bank may charge you an international transaction fee. ",
                  },
                  {
                    "text": "The payment card(s) used at the rental counter must be in the name of the main driver (the person named on the booking). ",
                  },
                  {
                    "text": "Credit cards need to be activated for international transactions and for payments abroad.",
                  },
                  {
                    "text": "You'll need to know the PIN of the payment card you are planning to use to pre-authorise your deposit.",
                  },
                  {
                    "text": "Visa Electron cards are not accepted",
                  },
                  {
                    "text": "Payment Cards",
                  }
                ]
              },
              {
                "subheading": "Accepted payment cards",
                "details": [
                  {
                    "text": "The counter staff can only accept the following credit cards for the deposit:<br> (you’ll need to have the physical card with you - and prepaid, recharge or virtual cards are not accepted)."
                  },
                  {
                    "text": "MasterCard"
                  },
                  {
                    "text": "Visa"
                  },
                  {
                    "text": "The counter staff can accept the following credit cards or debit cards, for purchases made locally:"
                  },
                  {
                    "text": "American Express"
                  },
                  {
                    "text": "Discover"
                  },
                  {
                    "text": "Amex"
                  },
                  {
                    "text": "JCB card"
                  },
                  {
                    "text": "Chinese UnionPay"
                  },
                  {
                    "text": "UnionPay"
                  },
                ]
              },
              {
                "subheading": "Licence Requirements",
                "details": [
                  {
                    "text": "When picking the car up, the main driver and any additional drivers will need to provide a full driving licence in their name."
                  },
                  {
                    "text": "Digital driving licences will not be accepted."
                  },
                  {
                    "text": "If you’ve had your driving licence renewed and it only shows the date it was renewed, you'll need to prove when it was originally issued."
                  },
                  {
                    "text": "All drivers must have held their driving licence for at least 3 years."
                  },
                  {
                    "text": "It is each driver’s responsibility to find out what paperwork they need before driving in another country. For example, you may need a visa and/or International Driving Permit as well as your driving licence."
                  },
                  {
                    "text": "Each driver will need to provide a valid driving licence. If it is written in non-Latin characters, they'll also need to provide a valid International Driving Permit or a certified translation. Any driver with a driving licence from outside Europe is advised to have an International Driving Permit as well."
                  }
                ]
              },
              {
                "subheading": "Forms of identification",
                "details": [
                  {
                    "text": "At the counter, you'll need to provide:"
                  },
                  {
                    "text": "Each driver's full, valid driving licence"
                  },
                  {
                    "text": "Your rental voucher"
                  }
                ]
              },
              {
                "subheading": "Additional  documents",
                "details": [
                  {
                    "text": "A credit card in the main driver's name"
                  },
                  {
                    "text": "Each driver's ID card"
                  },
                  {
                    "text": "Each driver's passport"
                  },
                  {
                    "text": "A current bank statement in the main driver's name"
                  },
                  {
                    "text": "A current utility bill in the main driver's name"
                  }
                ]
              },
              {
                "subheading": "Rules around IDs ",
                "details": [
                  {
                    "text": "You'll need to provide one of the following: (a) an airline boarding pass, (b) a train ticket, or (c) a ferry ticket. This must be for your return journey, and must show your departure time and date."
                  }
                ]
              },
              {
                "subheading": "Rental Voucher / eVoucher",
                "details": [
                  {
                    "text": "At pick-up, the car hire company will require EITHER a printed copy of the customer's voucher OR an eVoucher. If this is not presented, the car hire company may not allow the car to be picked up, or may charge again for the rental."
                  },
                  {
                    "text": "When you booked your car, you booked a certain make and model ‘or similar’ (‘similar’ means same gearbox, similar size, similar engine, etc.). The counter staff may provide a different car - not the exact make and model that you were expecting."
                  }
                ]
              },
              {
                "subheading": "Age Requirements",
                "details": [
                  {
                    "text": "To drive this car, you must be at least 25."
                  },
                  {
                    "text": "Additional drivers need to be at least 25 years old."
                  }
                ]
              },
              {
                "subheading": "Arrival details",
                "details": [
                  {
                    "text": "If you are arriving by plane, the car hire company needs your arrival flight number at least 3 days before your rental is due to start. If you do not provide your flight number, the car hire company cannot be held responsible if your plane is delayed and as a result your car is not available. Please ensure that you enter your flight number and not any other number the airline may have sent you, such as a confirmation number."
                  },
                  {
                    "text": "If your flight is delayed, please call the rental counter during their opening hours."
                  }
                ]
              }

            ]
          }
        },
        {
          "title": "Deposits, excess and cover",
          "sections": {
            "heading": "",
            "content": [
              {
                "subheading": "Cover information",
                "details": [
                  {
                    "text": "When you pick the car up, please make sure you read any terms and conditions before signing the rental agreement, including any terms of additional products you may purchase at the counter. It's very important that you understand the agreement/policy’s exclusions and limits, as well as the rules about anything you pay for at the rental counter."
                  }
                ]
              },
              {
                "subheading": "Deposit / Excess",
                "details": [
                  {
                    "text": "The car has a theft excess of $0.00 including tax."
                  },
                  {
                    "text": "The rental company will require a security deposit of $250.00 when you pick your car up. The deposit will be returned after the rental, as long as all conditions have been met."
                  },
                  {
                    "text": "There is no excess for the coverage provided by the car hire company’s CDW policy."
                  },
                  {
                    "text": "When you pick your car up, the counter staff will require a security deposit for the car. They may also require a security deposit for fuel in the tank and for certain extras (e.g. a child seat or GPS). After your rental, your deposit(s) will be returned."
                  },
                  {
                    "text": "Due to fluctuating foreign exchange rates and other possible banking charges, the car hire company cannot be held responsible for any difference between the amount paid and the amount refunded."
                  },
                  {
                    "text": "The Collision Damage Waiver and Theft Protection policies come with an ‘excess’. The excess is the amount that you will need to pay before the policy covers the rest of the cost (for anything the policy covers)."
                  }
                ]
              },
              {
                "subheading": "Additional Cover",
                "details": [
                  {
                    "text": "At the car hire counter, you may decide to buy additional cover to reduce or remove your excess, or to cover things your Collision Damage Waiver (CDW) doesn't, such as tyres and windscreen."
                  },
                  {
                    "text": "Please note: If you do, the contract will be between you and the rental company – so you’ll need to contact them if you're dissatisfied with the policy or the cover it provides."
                  },
                  {
                    "text": "If you’re involved in a 'single vehicle accident' and/or the bodywork is particularly badly damaged, the excess will be higher."
                  }
                ]
              },
              {
                "subheading": "Cover Arrangements",
                "details": [
                  {
                    "text": "Please make sure you read the terms and conditions of the cover you receive when signing the rental agreement at pick-up, to find out about the policy’s exclusions and limits."
                  },
                  {
                    "text": "Policies normally exclude things such as windscreens, glass, wheels, tyres, undercarriage, interior, personal belongings, towing charges & off-road time – as well as any ‘extra equipment’ hired from the car hire company, such as child seats and GPS devices."
                  },
                  {
                    "text": "Note that your cover will be invalidated by negligence, refuelling errors or breaking the terms of the rental agreement (for example, by driving under the influence of alcohol or drugs)."
                  }
                ]
              },
              {
                "subheading": "Administration Charges",
                "details": [
                  {
                    "text": "Damage to the car will be charged for by the car hire company after it is dropped off - and will incur a Damage Administration fee on top of the amount deducted from the excess."
                  },
                  {
                    "text": "An Immobilisation Charge is payable in the event of an accident. This is in addition to the amount deducted from the excess and is compulsory. This charge is calculated against the car group and the number of repair days."
                  },
                  {
                    "text": "If the car is damaged or stolen, the rental company will charge an administration fee. If you pay for damage/theft with a credit card, they'll charge an additional administration fee."
                  },
                  {
                    "text": "Once the rental is completed, customers need to return to the rental office to ask for a refund of the deposit. The deposit has to be repaid against the same payment card originally used."
                  }
                ]
              }
            ]
          }
        },
        {
          "title": "Fuel policy",
          "sections": {
            "heading": "",
            "content": [
              {
                "subheading": "Like for like",
                "details": [
                  {
                    "text": "When you pick your car up, the fuel tank will be full or partly full. You will leave a deposit to cover the cost of the fuel: the counter staff will block this money on your credit card. Just before you return your car, please replace the fuel you've used."
                  },
                  {
                    "text": "The fuel tank will be either full or part-full. When you pick the car up, please check how much fuel there is. On return, as long as you've replaced the fuel you've used, you’ll pay no fuel fees."
                  },
                  {
                    "text": "If you return your car with less fuel than it had when you picked it up, the car hire company will keep some or all of your deposit to cover the missing fuel. This will cost you more than you would pay to refill the tank yourself. As well as the cost of the fuel itself, you will pay a non-refundable fuel service charge of $15.99 including tax."
                  },
                  {
                    "text": "If there’s any fuel missing when you drop your car off, you'll be charged both a refuelling fee and the cost of the missing fuel (at the current market price per litre/gallon)."
                  }
                ]
              }
            ]
          }
        },
        {
          "title": "Extra services (payable at counter)",
          "sections": {
            "heading": "One-way rules",
            "content": [
              {
                "subheading": "One-way rules",
                "details": [
                  {
                    "text": "If you arrange to pick the car up in one location and drop it off in another, the car hire company may charge a one-way fee to cover the cost of returning the car to the original location. Prior notification is required for all one-way rentals. If you drop the car off at a location other than the one originally agreed; you will incur a 'Penalty' from the car hire company."
                  },
                  {
                    "text": "Cross-Border and Boundary rules"
                  }
                ]
              },
              {
                "subheading": "Cross-border",
                "details": [
                  {
                    "text": "Canada: Vehicles may be driven into Canada with no restrictions. The rental counter must be notified at the time of rental that you plan to drive into Canada so they can provide a Canadian non-resident insurance card (at no extra cost). Based on availability one-way rentals may be allowed to certain Canadian cities."
                  }
                ]
              },
              {
                "subheading": "Boundary Rules",
                "details": [
                  {
                    "text": "Customers must inform the car hire company of any cross-border travel as restrictions may apply in certain countries where the car cannot be taken."
                  },
                  {
                    "text": "The car may only be taken out of the country in which the rental began via land borders. The term ‘land borders’ includes borders on bridges or in tunnels – but taking the car on any boat or ferry will invalidate the cover supplied with the car as standard."
                  },
                  {
                    "text": "Any car picked up in Arizona (AZ), California (CA), Colorado (CO), Nevada, (NV), Oregon (OR), Utah (UT), or Washington (WA) may be taken into Canada - but only in the province of Columbia."
                  },
                  {
                    "text": "Any car picked up in Illinois (IL), Maryland (MD), Massachusetts (MA), Minnesota (MN), New Jersey (NJ), New York (NY), Pennsylvania (PA), Virginia (VA) or Wisconsin (WI) may be taken into Canada - but only in the provinces of Ontario, Quebec, and New Brunswick."
                  }
                ]
              },
              {
                "subheading": "Taxes & Fees",
                "details": [
                  {
                    "text": "Any additional services will be subject to any applicable sales taxes and location fees."
                  }
                ]
              }
            ]
          }
        },
        {
          "title": "Extra Equipment",
          "sections": {
            "heading": "",
            "content": [
              {
                "subheading": "Pay local extras equipment",
                "details": [
                  {
                    "text": "As explained during the booking process, extras (child seats, GPS, etc.) will be either:"
                  },
                  {
                    "text": "• Included in the cost of your rental, or"
                  },
                  {
                    "text": "• Ordered and paid for when booking your car, or"
                  },
                  {
                    "text": "• Requested when booking your car and paid for at pick-up (in which case, we can’t guarantee that they’ll be available, or that the price will be the same)."
                  }
                ]
              },
              {
                "subheading": "Extra Equipment Conditions",
                "details": [
                  {
                    "text": "Additional extras will be subject to any applicable sales taxes and location taxes."
                  },
                  {
                    "text": "If an extra is lost, damaged or stolen, you'll pay a replacement fee."
                  },
                  {
                    "text": "If the car is picked up in one location and dropped off in another, the rental company may charge a One-Way Fee to cover the cost of returning an extra to the original location."
                  },
                  {
                    "text": "Please note: counter staff aren’t trained (or allowed) to fit baby/child/booster seats. You will need to fit these yourself."
                  }
                ]
              },
              {
                "subheading": "Additional drivers",
                "details": [
                  {
                    "text": "The car hire company’s age-related charges and restrictions will apply to all additional drivers."
                  }
                ]
              }
            ]
          }
        },
        {
          "title": "Important information",
          "sections": {
            "heading": "",
            "content": [
              {
                "subheading": "Important information",
                "details": [
                  {
                    "text": "By making this booking, you’re confirming that you have read and accept the rental terms. At the rental counter, customers will also sign a rental agreement before they give you the key. It’s important that you read that agreement carefully - and if anything isn’t clear, discuss it with the counter staff before you sign."
                  },
                  {
                    "text": "Your rental company reserves the right to refuse a car if, in the counter staff’s opinion, the driver is unfit to drive or anyone in the group is threatening, abusive or in any way endangering the health and safety of other people. If this happens, you will not be entitled to any refund or compensation."
                  },
                  {
                    "text": "Please see ‘What you need at pick-up’ above - and note that the counter staff will not provide a car unless all requirements (age, driving licence, payment card, documentation, etc.) are met. If this happens, you will not be entitled to any refund or compensation."
                  },
                  {
                    "text": "Before you drive off, you must check the car and make sure that any damage is reported to the counter staff and noted on the rental agreement. Otherwise, you may end up being liable for that damage."
                  }
                ]
              },
              {
                "subheading": "Road rules",
                "details": [
                  {
                    "text": "When you rent a car, you are agreeing to use it responsibly. You must not:"
                  },
                  {
                    "text": "• drive under the influence of alcohol, drugs, or any other type of narcotic substances."
                  },
                  {
                    "text": "• transport any inflammable or dangerous goods, or any toxic, corrosive, radioactive or otherwise harmful substances."
                  },
                  {
                    "text": "• carry anything which, because of its smell and/or condition, could damage the car or cause the rental company to lose time or money."
                  },
                  {
                    "text": "• transport live animals."
                  },
                  {
                    "text": "• install a roof rack, luggage carrier or anything similar, unless supplied by the rental company."
                  },
                  {
                    "text": "• rent the car to anyone else."
                  },
                  {
                    "text": "• carry passengers for hire or reward (taxi)."
                  },
                  {
                    "text": "• participate in rallies, competitions or trials."
                  },
                  {
                    "text": "• give driving lessons."
                  },
                  {
                    "text": "• tow another vehicle."
                  },
                  {
                    "text": "• travel on unpaved roads or roads where the surface or state of repair could damage the car."
                  },
                  {
                    "text": "• in any way break the highway code, road traffic laws or other laws."
                  },
                  {
                    "text": "Seatbelt - Whatever country you’re driving in, driver and passengers must wear seatbelts if fitted, wherever they’re sitting in the car."
                  },
                  {
                    "text": "Please be aware that all cars have a non-smoking policy. Fines will apply if this policy is not adhered to."
                  },
                  {
                    "text": "To make sure you understand the rules and laws about driving hire cars at home and abroad, it’s essential you read the Terms & Conditions in full before you leave to pick your car up."
                  },
                  {
                    "text": "In particular, please make sure you know what documents and other paperwork you must take with you (e.g. driving licence, forms of identification, and payment cards) and what you’ll need to pay for at the car hire counter. If you don’t have everything you need, the car hire company may not let you pick the car up."
                  },
                  {
                    "text": "If you intend to do any city driving, there may be traffic restrictions based on your car’s licence plate, so please tell the counter staff when you go to pick up your car."
                  }
                ]
              },
              {
                "subheading": "On the road",
                "details": [
                  {
                    "text": "In the event of a breakdown, accident or mechanical difficulties, you must call the car hire company immediately. They must give authority for repairs or replacement cars. Please keep copies of all documentation you are asked to complete. This may be needed if you wish to make a claim. For accidents, a police report and an incident report from the car hire counter will be required."
                  },
                  {
                    "text": "If you are having any problems with your rental car, please call the rental company."
                  },
                  {
                    "text": "Car Hire Company Important Information"
                  }
                ]
              },
              {
                "subheading": "Price calculation",
                "details": [
                  {
                    "text": "Please note that exchange rates can fluctuate - and no-one in the car rental industry can do anything about this. As a result, you might find that charges on your statement aren’t an exact match with the price you were told while booking. The same goes for any refund you may receive."
                  },
                  {
                    "text": "Prices are based on the pick-up and drop-off times and dates that you agree before your rental starts. If you pick the car up any later or bring it back any earlier, you will not receive a refund for unused time."
                  },
                  {
                    "text": "If, at pick-up, you choose to take a different car, there may be an additional charge for this – even if the new car is smaller than the one you had booked."
                  }
                ]
              },
              {
                "subheading": "Penalty fees",
                "details": [
                  {
                    "text": "An Immobilisation Charge is payable in the event of an accident. This is in addition to the amount deducted from the excess and is compulsory. This charge is calculated against the car group and the number of repair days."
                  },
                  {
                    "text": "Lost Keys - If you lose your key(s), you will be charged the cost of replacement."
                  },
                  {
                    "text": "If you've not returned the car after your agreed drop-off time, the insurance will no longer be valid. Plus, you will be charged a penalty fee as well as the cost of another day's rental."
                  }
                ]
              },
              {
                "subheading": "Grace period",
                "details": [
                  {
                    "text": "You must be at the rental counter by your pick-up time: if you’re late, the car may no longer be available, and you won’t be entitled to a refund. If you think you might be late, it's vital that you contact the rental company at least 30 minutes before your pick-up time, even if it's because of a flight delay and you’ve provided your flight number."
                  },
                  {
                    "text": "In case of delay, reservations will be held for 59 minutes from the specified reservation time, after which they will be classed as a no-show."
                  }
                ]
              },
              {
                "subheading": "Valeting",
                "details": [
                  {
                    "text": "The car hire company will charge you if the car needs more than a reasonable amount of cleaning after your rental."
                  }
                ]
              },
              {
                "subheading": "Company Registration Details",
                "details": [
                  {
                    "text": "For a full list of partners, please click here."
                  },
                  {
                    "text": "Avis Belgium SA NV, Rue Colonel Bourgstraat 122b7 Brussels B1440 BE, BE0415872355."
                  }
                ]
              }

            ]
          }
        }
      ]

      // subSectionList: [
      //   {
      //     title: 'Full rental terms',
      //     content: 'At pick-up, the main driver will leave a refundable security deposit of $300.00 on their credit card. Cash and debit cards are not accepted. ',
      //   },
      //   {
      //     title: 'Full rental terms',
      //     content: 'At pick-up, the main driver will leave a refundable security deposit of $300.00 on their credit card. Cash and debit cards are not accepted. ',
      //   },
      //   {
      //     title: 'Full rental terms',
      //     content: 'At pick-up, the main driver will leave a refundable security deposit of $300.00 on their credit card. Cash and debit cards are not accepted. ',
      //   },
      //   {
      //     title: 'Full rental terms',
      //     content: 'At pick-up, the main driver will leave a refundable security deposit of $300.00 on their credit card. Cash and debit cards are not accepted. ',
      //   },
      //   {
      //     title: 'Full rental terms',
      //     content: 'At pick-up, the main driver will leave a refundable security deposit of $300.00 on their credit card. Cash and debit cards are not accepted. ',
      //   },
      //   {
      //     title: 'Full rental terms',
      //     content: 'At pick-up, the main driver will leave a refundable security deposit of $300.00 on their credit card. Cash and debit cards are not accepted. ',
      //   },
      //   {
      //     title: 'Full rental terms',
      //     content: 'At pick-up, the main driver will leave a refundable security deposit of $300.00 on their credit card. Cash and debit cards are not accepted. ',
      //   },
      //   {
      //     title: 'Full rental terms',
      //     content: 'At pick-up, the main driver will leave a refundable security deposit of $300.00 on their credit card. Cash and debit cards are not accepted. ',
      //   },
      //   {
      //     title: 'Full rental terms',
      //     content: 'At pick-up, the main driver will leave a refundable security deposit of $300.00 on their credit card. Cash and debit cards are not accepted. ',
      //   },
      //   {
      //     title: 'Full rental terms',
      //     content: 'At pick-up, the main driver will leave a refundable security deposit of $300.00 on their credit card. Cash and debit cards are not accepted. ',
      //   },
      //   {
      //     title: 'Full rental terms',
      //     content: 'At pick-up, the main driver will leave a refundable security deposit of $300.00 on their credit card. Cash and debit cards are not accepted. ',
      //   },
      // ]
    },
    // { title: 'Damage Excess', content: '$0.00 If the car’s bodywork was damaged during your rental, you would nt pay anything at all towards repairs.This cover is only valid if you stick to the terms of the rental agreement. It doesnt cover other parts of the car (e.g. windows, wheels, interior or undercarriage), or charges (e.g. for towing or off-road time), or anything in the car (e.g. child seats, GPS devices or personal belongings).' },
  ];

  content: any = "";
  termsAndConditionsObj: any = {};

  constructor(
    public dialogRef: MatDialogRef<ImportantNoticeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public cabService: CabService,
    public gs: GlobalService,
  ) {
    this.getImportantNotice();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getImportantNotice() {
    let body = {
      "code": "IMPINFO",
      "noticeType": 0
    }
    this.gs.isSpinnerShow = true;
    this.cabService.getImportantNotice(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      console.log("response >>>>>>", response);
      if (response && response.noticeDescription) {
        this.termsAndConditionsObj = response;
        // console.log("this.termsAndConditionsObj >>>>>>", this.termsAndConditionsObj);
        this.content = response.noticeDescription;
      }
    }, err => {
      this.gs.isSpinnerShow = false;
    })
  }
}
