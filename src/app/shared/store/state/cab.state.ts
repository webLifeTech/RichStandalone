import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { cab } from "../../interface/cab";
import { CabService } from "../../services/cab.service";
import { getCab } from "../action/cab.action";

export class cabModal {
  data: {
    cab: cab[];
  };
}

@State<cabModal>({
  name: 'cab',
  defaults: {
    data: {
      cab: [],
    },
  },
})

@Injectable()
export class cabState {

  public cabs: cab[];
  constructor(private cabService: CabService) { }

  @Selector()
  static cab(state: cabModal) {
    return state.data.cab;
  }

  @Action(getCab)
  getData(ctx: StateContext<cabModal>, action: getCab) {

    return this.cabService.getCabDetails(action.filter).pipe(
      tap((res) => {

        if (action.price.minPrice != 0 || action.price.maxPrice != 0) {
          this.cabs = res.filter(
            (item: { price: number }) =>
              item.price >= action.price.minPrice && item.price <= action.price.maxPrice
          );
        } else {
          this.cabs = res
        }

        ctx.setState({
          data: {
            cab: this.cabs,
          },
        });

      })
    )
  }
}
