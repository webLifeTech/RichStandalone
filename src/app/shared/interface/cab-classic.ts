import { booking } from "./cab";

export interface ricaBenefit{
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface cabClassic{
  ricaBenefits: ricaBenefit[];
  booking: booking[];
  carTypes: carTypes[];
  testimonial: number[];
  brand: brand[];
}

export interface carTypes{
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  seat?: boolean;
  luggage?: boolean;
  snow?: boolean;
  setting?: boolean;
}


export interface cabDetails{
  id: number;
  title: string;
  description?: string;
  image: string;
  price: number;
  barcode: string;
  type?: string;
}

export interface animatedImage{
  id: number;
  url: string;
  title: string;
  subTitle?: string;
}

export interface brand{
  id: number;
  logo: string;
}

