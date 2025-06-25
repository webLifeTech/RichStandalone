

export interface cabs {
  cab: cab[]
}

export interface cabDetails {
  cabGallery: cabGallery[];
  cabDetails: cabDetail[],
  cabBooking: cabBooking[]
}

export interface cab {
  id: number;
  carName: string;
  carBrand: string;
  carImage: string;
  carImages: images[];
  brandLogo: images[];
  carType: string;
  isAddWishlist: boolean;
  hash_key: boolean;
  unlimittedMileage: boolean;
  offer_discount: boolean;
  price: number;
  fare: number;
  per_km: number;
  passenger: number;
  luggage: number;
  gearbox: string;
  carOption: string;
  rating: number;
  review: number;
  category: string;
  status: string;
  tags: string[];
}

export interface pagination {
  totalItems: number,
  currentPage: number,
  pageSize: number,
  totalPages: number,
  startPage: number,
  endPage: number,
  startIndex: number,
  endIndex: number,
  pages: number[],
}

export interface cabGallery {
  id: number;
  image: string;
  type: string;
}

export interface cabDetail {
  title: string;
  details: data[]
}

export interface data {
  data: string;
}

export interface cabBooking {
  id: number;
  title: string;
  value: string;
  type: string;
  panel: string;
  checkId: string;
  checked: boolean;
}


export interface blog {
  blog: blogs[]
}

export interface blogs {
  id: number;
  blogTitle: string;
  description: string;
  location?: string;
  url: string;
  date: string;
  month: string;
  posted_by?: string;
  posted_date?: string;
}

export interface services {
  services: service[]
}

export interface service {
  id: number;
  title: string;
  description: string;
  url?: string;
  subTitle?: string;
  rating?: number;
  additionalData?: string;
}

export interface testimonials {
  testimonial: testimonial[]
}

export interface testimonial {
  id: number;
  name: string;
  description: string;
  profileURL: string;
}



export interface currency {
  name: string;
  currency: string; value: string;
  symbol: string;
  price: number
}

export interface priceFilter {
  minPrice: number;
  maxPrice: number
}

export interface images {
  url: string;
  fileType: string
}
export interface booking {
  id: number;
  title: string;
  image: string;
}


export interface blog {
  blog: blogs[]
}

export interface blogs {
  id: number;
  blogTitle: string;
  description: string;
  location?: string;
  url: string;
  date: string;
  month: string;
  posted_by?: string;
  posted_date?: string;
}
