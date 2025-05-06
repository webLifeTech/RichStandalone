import { Injectable } from '@angular/core';

// Menu
export interface Menu {
  items?: Menu[]
  path?: string;
  queryParams?: object;
  title?: string;
  icon?: string;
  type?: string;
  megaMenu?: boolean;
  image?: string;
  active?: boolean;
  badge?: boolean;
  badgeText?: string;
  badgeIcon?: boolean;
  children?: Menu[];
  level?: number;
  section?: Menu[]
  right?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor() { }

  public MENUITEMS: Menu[] = [
    {
      title: "menu.home",
      type: 'link',
      active: false,
      level: 1,
      path: '/home',
    },
    {
      title: "menu.aboutus",
      type: 'link',
      active: false,
      level: 1,
      path: '/home',
    },
    {
      title: "menu.car_rentals",
      type: 'link',
      active: false,
      level: 1,
      path: '/cab/listing/list-view',
      queryParams: { type: 'car' }
    },
    {
      title: "menu.driver_rentals",
      type: 'link',
      active: false,
      level: 1,
      path: '/cab/listing/list-view',
      queryParams: { type: 'driver' }
    },
    {
      title: "menu.vendors",
      type: 'link',
      active: false,
      level: 1,
      path: '/user/profile',
      queryParams: { type: 'vendor' }
    },
    {
      title: "menu.services",
      type: 'link',
      active: false,
      level: 1,
      path: '/services',
    },
    {
      title: "menu.pricing",
      type: 'link',
      active: false,
      level: 1,
      path: '/pricing'
    },

  ]

  public USER_MENUITEMS: Menu[] = [
    {
      title: "admin_menu.dashboard",
      type: 'link',
      active: false,
      level: 1,
      path: '/home',
    },
    {
      title: "admin_menu.cars",
      type: 'link',
      active: false,
      level: 1,
      path: '/home',
    },
    {
      title: "admin_menu.trasaction",
      type: 'link',
      active: false,
      level: 1,
      path: '/home',
    },
    {
      title: "admin_menu.report",
      type: 'sub',
      active: false,
      level: 1,
      children: [{
        title: "admin_menu.submenus.payment",
        type: 'link',
        active: false,
        level: 2,
        path: '/home',
      }, {
        title: "admin_menu.submenus.enquiry",
        type: 'link',
        active: false,
        level: 2,
        path: '/home',
      },]
    },
    {
      title: "admin_menu.dashboard",
      type: 'link',
      active: false,
      level: 1,
      path: '/home',
    },
    {
      title: "admin_menu.cars",
      type: 'link',
      active: false,
      level: 1,
      path: '/home',
    },
    {
      title: "admin_menu.trasaction",
      type: 'link',
      active: false,
      level: 1,
      path: '/home',
    },
    {
      title: "admin_menu.report",
      type: 'sub',
      active: false,
      level: 1,
      children: [{
        title: "admin_menu.submenus.payment",
        type: 'sub',
        active: false,
        level: 2,
        children: [{
          title: "admin_menu.submenus.micromenu.payment1",
          type: 'link',
          active: false,
          level: 3,
          path: '/home',
        }, {
          title: "admin_menu.submenus.micromenu.payment2",
          type: 'link',
          active: false,
          level: 3,
          path: '/home',
        },]
      }, {
        title: "admin_menu.submenus.enquiry",
        type: 'link',
        active: false,
        level: 2,
        path: '/home',
      },]
    },
  ]
}
