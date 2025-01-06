export interface ticketSectionModel{
  ticketSection: ticketSection[]
}

export interface ticketSection{
  id: number;
  ticketTitle: string;
  url: string;
  title: string;
  subTitle: string;
  subTitle2: string;
  description: string;
  price: number,
  barcode: string;
}
