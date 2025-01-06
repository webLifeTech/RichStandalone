import { d_priceFilter } from "../../interface/driver";

// Driver Filter
export class getDriver {
  static readonly type = '[driver] Get';
  constructor(public filter: string[], public price: d_priceFilter) { }
}
