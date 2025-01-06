export interface routerlink {
  url: string;
}
export interface pageSelection {
  skip: number;
  limit: number;
}
export interface apiResultFormat {
  data: [];
  totalData: number;
}

export interface popularCars1 {
  carName: string;
  img1: string;
  img2: string;
  carModel: string;
  rating: string;
  carDetail1: string;
  carDetail2: string;
  carDetail3: string;
  carDetail4: string;
  carDetail5: string;
  carDetail6: string;
  country: string;
  price: string;
  heading: string;
  text: string;
  like: boolean;
}
export interface popularCars2 {
  carName: string;
  img1: string;
  img2: string;
  carModel: string;
  rating: string;
  carDetail1: string;
  carDetail2: string;
  carDetail3: string;
  carDetail4: string;
  carDetail5: string;
  carDetail6: string;
  country: string;
  price: string;
  heading: string;
  text: string;
  like: boolean;
}
export interface popularCars3 {
  carName: string;
  img1: string;
  img2: string;
  carModel: string;
  rating: string;
  carDetail1: string;
  carDetail2: string;
  carDetail3: string;
  carDetail4: string;
  carDetail5: string;
  carDetail6: string;
  country: string;
  price: string;
  heading: string;
  text: string;
  like: boolean;
}
export interface popularCars4 {
  carName: string;
  img1: string;
  img2: string;
  carModel: string;
  rating: string;
  carDetail1: string;
  carDetail2: string;
  carDetail3: string;
  carDetail4: string;
  carDetail5: string;
  carDetail6: string;
  country: string;
  price: string;
  heading: string;
  text: string;
  like: boolean;
}
export interface popularCars5 {
  carName: string;
  img1: string;
  img2: string;
  carModel: string;
  rating: string;
  carDetail1: string;
  carDetail2: string;
  carDetail3: string;
  carDetail4: string;
  carDetail5: string;
  carDetail6: string;
  country: string;
  price: string;
  heading: string;
  text: string;
  like: boolean;
}
export interface popularCars6 {
  carName: string;
  img1: string;
  img2: string;
  carModel: string;
  rating: string;
  carDetail1: string;
  carDetail2: string;
  carDetail3: string;
  carDetail4: string;
  carDetail5: string;
  carDetail6: string;
  country: string;
  price: string;
  heading: string;
  text: string;
  like: boolean;
}
export interface recommendedCar {
  img: string;
  text: string;
  carModel: string;
  heading: string;
  name: string;
  carDetail1: string;
  carDetail2: string;
  carDetail3: string;
  carDetail4: string;
  carDetail5: string;
  carDetail6: string;
  title: string;
}
export interface testimonial {
  img: string;
  Name: string;
  rating: string;
  para: string;
}
export interface carTypes {
  img: string;
  heading: string;
  cars: string;
}
export interface listingDetails {
  img: string;
}
export interface testimonials {
  name: string;
  location:string;
  title: string;
  content: string;
  
  
}
export interface thumbnails1 {
  img: string;
}

export interface thumbnails {
  img: string;
}
export interface interestedCars {
  carName: string;
  img1: string;
  img2: string;
  carModel: string;
  rating: string;
  carDetail1: string;
  carDetail2: string;
  carDetail3: string;
  carDetail4: string;
  carDetail5: string;
  carDetail6: string;
  country: string;
  price: string;
  heading: string;
  text: string;
  like: boolean;
}
export interface listingGrid {
  carName: string;
  img1: string;
  img2: string;
  carModel: string;
  rating: string;
  carDetail1: string;
  carDetail2: string;
  carDetail3: string;
  carDetail4: string;
  carDetail5: string;
  carDetail6: string;
  country: string;
  price: string;
  heading: string;
  text: string;
  like: boolean;
}
export interface header {
  tittle: string;
  showAsTab: boolean;
  separateRoute: boolean;
  routes?: string;
  hasSubRoute?: boolean;
  showSubRoute?: boolean;
  menu?: menu[];
  base?: string;
}
export interface menu {
  menuValue: string;
  routes?: string;
  hasSubRoute: boolean;
  showSubRoute: boolean;
  subMenus?: submenu[];
  page1?: string;
  page2?: string;
  page3?: string;
  page4?: string;
  page5?: string;
  page6?: string;
  page7?: string;
  page8?: string;
  page9?: string;
  page10?: string;
  page11?: string;
}
export interface submenu {
  menuValue: string;
  routes: string;
  hasSubRoute: boolean;
  showSubRoute: boolean;
  subMenus: [];
}
export interface carousel {
  img: string;
  Name: string;
  rating: string;
  para: string;
}
export interface userPayment {
    id: number;
    bookingID: string;
    carName: string;
    paidOn: string;
    mode: string;
    total: string;
    status: string;
    img:string;
    feature: string;
    isSelected: boolean;
  }
  export interface userReview {
    id: number;
    carName: string;
    rentalType: string;
    review: string;
    ratings: string;
    img: string;
    feature: string;
    isSelected: boolean;
    rating: string;
  }
  export interface userWallet {
    id: number;
    refId: string;
    transactionFor: string;
    date: string;
    total: string;
    status: string;
    isSelected: boolean;
  }
  
export interface userBookingCancelled {
  isSelected: boolean;
  id: number;
  bookingId: string;
  carName: string;
  img: string;
  deliveryStatus: string;
  rentalType: string;
  pickupDeliveryLocation1: string;
  dropoffLocation1: string;
  dropoffLocation2: string;
  bookedOn: string;
  total: string;
  cancelledBy: string;
  reason: string;
  status: string;
  pickupDeliveryLocation2: string;
}
export interface userBookingComplete {
  isSelected: boolean;
  id: number;
  bookingId: string;
  carName: string;
  img: string;
  rentalType: string;
  deliveryStatus: string;
  pickupDeliveryLocation1: string;
  pickupDeliveryLocation2: string;
  dropoffLocation1: string;
  dropoffLocation2: string;
  bookedOn: string;
  total: string;
  status: string;
}
export interface userBookingInprogress {
  isSelected: boolean;
  id: number;
  bookingId: string;
  carName: string;
  deliveryStatus: string;
  rentalType: string;
  pickupDeliveryLocation1: string;
  pickupDeliveryLocation2: string;
  dropoffLocation1: string;
  dropoffLocation2: string;
  bookedOn: string;
  total: string;
  status: string;
  img: string;
}
export interface userBookingUpcoming {
  isSelected: boolean;
  id: number;
  bookingId: string;
  carName: string;
  deliveryStatus: string;
  rentalType: string;
  pickupDeliveryLocation1: string;
  pickupDeliveryLocation2: string;
  dropoffLocation1: string;
  dropoffLocation2: string;
  bookedOn: string;
  total: string;
  status: string;
  img: string;
}
export interface userBookings {
  isSelected: boolean;
  id: number;
  bookingId: string;
  carName: string;
  deliveryStatus: string;
  rentalType: string;
  pickupDeliveryLocation1: string;
  pickupDeliveryLocation2: string;
  dropoffLocation1: string;
  dropoffLocation2: string;
  bookedOn: string;
  total: string;
  status: string;
  img: string;
}
