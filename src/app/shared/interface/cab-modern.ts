export interface cabModern{
  category: number[];
  ticketSection: number[];
  service: number[];
  deals: number[];
  call: animatedImage[];
  blog: number[];
  brand: brand[];
}


export interface cabDetailsModern{
  cab: cabDetails[];
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
