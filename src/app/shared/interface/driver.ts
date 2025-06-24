

export interface drivers {
  driver: driver[]
}

export interface driversDetails {
  cabGallery: cabGallery[];
  driversDetails: driverDetails[]
}

export interface driver {
  driverName: string;
  rating: number;
  reviews: number;
  driverImage: string;
  offer_discount: number;
  brandLogo: images[];
  isAddWishlist: boolean;
  hash_key: string;
  kyc_id: string;
  isPurchased: boolean;
  price: number;
  location: string;
  experience: string;
  status: string;
  tags: string[];
}

export interface d_pagination {
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

export interface driverDetails {
  title: string;
  details: data[]
}

export interface data {
  data: string;
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

export interface d_priceFilter {
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
