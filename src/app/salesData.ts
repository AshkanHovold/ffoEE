export class SalesData {
  oil = 0;
  bushels = 0;
  turnsLeft = 0;
  foodProduction = 0;
  oilProduction = 0;
  foodToProduce = 0;
  oilToProduce = 0;
  foodOnHand = 0;
  oilOnHand = 0;
  totalFood = 0;
  totalOil = 0;
  turnsOnHand = 0;
  sum = 0;
  days = 0;
  nw = 0;
  netIncome = 0;
  serverEnds = '';
  currentTime = '';

  calcFoodToProduce() {
    this.foodToProduce = this.turnsLeft * this.foodProduction;
  }

  calcOilToProduce() {
    this.oilToProduce = this.turnsLeft * this.oilProduction;
  }

  calcTotalFood() {
    this.totalFood = this.foodOnHand + this.bushels + this.foodToProduce;
  }

  calcTotalOil() {
    this.totalOil = this.oilOnHand + this.oil + this.oilToProduce;
  }
  setDaysLeft(days: number) {
    this.days = days;
    this.updateTurnsLeft();
    //this.calcAll();
  }
  updateTurnsLeft() {
    this.turnsLeft = Math.floor(this.days * 78) + this.turnsOnHand;
  }

  setTurnsOnHand(turns: number) {
    this.turnsOnHand = turns;
    this.updateTurnsLeft();
    this.calcAll();
  }

  calcAll() {
    this.setDaysLeft(
      this.daysBetween(this.currentTime, this.serverEnds)
    );
    this.calcFoodToProduce();
    this.calcOilToProduce();
    this.calcTotalFood();
    this.calcTotalOil();
  }

  daysBetween(isoDate1: string, isoDate2: string): number {
    // Parse the ISO strings into Date objects
    const date1 = new Date(isoDate1);
    const date2 = new Date(isoDate2);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = Math.abs(
      date2.getTime() - date1.getTime()
    );

    // Convert the difference from milliseconds to days
    const daysDifference = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    return daysDifference;
  }

  processData(value: string) {
    this.oil = 0;
    this.bushels = 0;
    this.sum = 0; // reset sum

    let lines = value.split('\n');

    for (let line of lines) {
      let matchedValues = line.match(/([0-9,$.(])/g);
      if (!matchedValues) continue; // Skip iteration if there's no match

      let amountAndPrice = matchedValues.join('').split('(')[0].split('$');

      if (amountAndPrice.length < 2) continue; // Ensure we have both amount and price before proceeding

      let amount = parseInt(amountAndPrice[0].replaceAll(',', ''));
      let price = parseFloat(amountAndPrice[1].replaceAll(',', ''));

      this.sum += amount * price; // accumulate total sales
      this.sum = this.sum * 0.94;
      if (line.includes('Bushels')) {
        this.bushels += amount;
      }
      if (line.includes('Barrels')) {
        this.oil += amount;
      }
    }
    this.calcAll();
  }
}
