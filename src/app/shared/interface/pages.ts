import { animatedImage } from "./cab-modern";
import { images } from "./cab";

export interface pages {
  portfolio: portfolio[];
  blogPage: blogPage[];
  blogDetailPage: blogDetailPage[];
  otherPages: otherPages;
  elementPages: elementPages;
}

export interface portfolio {
  tab: portfolioTab[];
  gallery: portfolioGallery[];
  masonryGallery: portfolioGallery[];
  parallaxImages: portfolioGallery[];
  centerSlideImages: portfolioGallery[];
  creativeSection: portfolioGallery[];
  creativeSectionMasonry: portfolioGallery[];
}

export interface portfolioTab {
  id: number;
  title: string;
  value: string;
}

export interface portfolioGallery {
  id: number;
  image: string;
  title?: string;
  description?: string;
  type?: string;
  right?: boolean;
  class?: string;
}

export interface blogPage {
  blog: number[];
  blogFilter: blogFilter[]
}

export interface blogFilter {
  blogCategory: blogCategory[];
  blogPopularPost: blogPopularPost[];
  blogPopularTags: blogCategory[];
}

export interface blogCategory {
  id: number;
  title: string;
}

export interface blogPopularPost {
  id: number;
  image: string;
  date: string;
  hits: number
}

export interface blogDetailPage {
  blogDetail: blogDetail;
  blogComments: blogComments[];
}

export interface blogDetail {
  id: number;
  title: string;
  image: string;
  images: images[];
  date: string;
  posted_by: string;
  hits: number;
  comments: number;
  blogData: blogData[]
}

export interface blogData {
  data: string;
}

export interface blogComments {
  id: number;
  name: string;
  image: string;
  comment: string;
  date: string;
}

export interface otherPages {
  about: about[];
  contact: contact[];
  faq: faq;
  userDashboard: userDashboard;
}

export interface about {
  gallery: animatedImage[];
  team: team[];
  testimonial: number[];
  fact: fact[];
  blog: number[];
  services: aboutService[];
}

export interface team {
  id: number;
  name: string;
  image: string;
  designation: string;
}

export interface fact {
  id: number;
  image: string;
  title: string;
  count: number;
}

export interface aboutService {
  id: number;
  title: string;
  subTitle: string;
  description: string;
  icon: string;
  rating: number;
}

export interface contact {
  id: number;
  title: string;
  icon: string;
  details: blogData[];
}

export interface faq {
  tabs: tabs[];
  details: faqDetails[];
}

export interface tabs {
  id: number;
  title: string;
  value: string;
  route: string;
  icon: string;
}

export interface faqDetails {
  id: number;
  title: string;
  description: string;
}

export interface userDashboard {
  tabs: tabs[];
  dashboardDetails: dashboardDetails;
  userProfile: userProfile[];
  booking: booking[];
  cards: cards[];
  bookmark: bookmark[];
}

export interface dashboardDetails {
  verificationDetail: verificationDetail[];
  totalCount: totalCount[];
  recentActivity: recentActivity[];
}

export interface verificationDetail {
  id: number;
  title: string;
  verified: boolean;
}

export interface totalCount {
  id: number;
  title: string;
  count: number;
  image: string;
}

export interface recentActivity {
  id: number;
  title: string;
  date: string;
  icon: string;
  class?: string;
}

export interface userProfile {
  title: string;
  value?: string;
  modal?: boolean;
  modalValue?: string;
  details: userProfile[];
}

export interface booking {
  id: number;
  title: string;
  details: bookingDetails[];
}

export interface bookingDetails {
  id: number;
  title: string;
  amount: number;
  travelId: string;
  travelDate: string;
  day: string;
  date: number;
  month: string;
  travelDetail: string;
  icon: string;
}

export interface cards {
  id: number,
  holderName: string;
  cardNumber: string;
  expDate: string;
  cardIcon: string;
  primary?: boolean,
  class: string;
}

export interface bookmark {
  id: number;
  title: string;
  subTitle: string;
  image: string;
}

export interface elementPages {
  imageRatio: imageRatio;
  button: elementButton[];
}

export interface imageRatio {
  images: images[];
  ratioDetails: ratioDetails[];
}

export interface ratioDetails {
  title: string;
  subTitle: string;
  ratioClass: string;
}

export interface elementButton {
  id: number;
  title: string;
  colClass: string;
  buttonData?: buttonData[];
  input?: boolean;
  buttonGroup?: boolean;
  grid?: boolean;
}

export interface buttonData {
  id: number;
  title: string;
  buttonClass: string
}
