import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { driver } from "../../interface/driver";
import { DriverService } from "../../services/driver.service";
import { getDriver } from "../action/driver.action";

export class driverModal {
  data: {
    driver: driver[];
  };
}

@State<driverModal>({
  name: 'driver',
  defaults: {
    data: {
      driver: [],
    },
  },
})

@Injectable()
export class driverState {

  public drivers: driver[];
  constructor(private driverService: DriverService) { }

  @Selector()
  static driver(state: driverModal) {
    return state.data.driver;
  }

  @Action(getDriver)
  getData(ctx: StateContext<driverModal>, action: getDriver) {
    return this.driverService.getDriverDetails(action.filter).pipe(
      tap((res) => {
        if (action.price.minPrice != 0 || action.price.maxPrice != 0) {
          this.drivers = res.filter(
            (item: { price: number }) =>
              item.price >= action.price.minPrice && item.price <= action.price.maxPrice
          );
        } else {
          this.drivers = res
        }

        ctx.setState({
          data: {
            driver: this.drivers,
          },
        });

      })
    )
  }
}
