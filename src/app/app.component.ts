// prettier-ignore
import { Component, VERSION } from '@angular/core';
import { SalesData } from './salesData';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  salesData = new SalesData();

  datetime = new Date(new Date().toUTCString()).toISOString();
  timeLocal = new Date(this.datetime).toLocaleString();
  isoTime = new Date().toISOString();

  displayedColumns: string[] = ['label', 'value'];
  tableData: any[] = [];

  updateTableData() {
    this.tableData = [
      { label: 'Turns left', value: this.salesData.turnsLeft },
      { label: 'Turns on hand', value: this.salesData.turnsOnHand },
      { label: 'Food to be produced', value: this.salesData.foodToProduce },
      { label: 'Oil to be produced', value: this.salesData.oilToProduce },
      { label: 'Food Production', value: this.salesData.foodProduction },
      { label: 'Oil Production', value: this.salesData.oilProduction },
      { label: 'Food On Hand', value: this.salesData.foodOnHand },
      { label: 'Oil On Hand', value: this.salesData.oilOnHand },
      { label: 'Final projected food', value: this.salesData.totalFood },
      { label: 'Final projected oil', value: this.salesData.totalOil },
    ];
  }

  parse(event: any) {
    this.salesData.processData(event.target.value);
    this.updateTableData();
  }

  daysLeft(event: any) {
    this.salesData.setDaysLeft(event.target.value);
    this.updateTableData();
  }

  foodProd(event: any) {
    this.salesData.foodProduction = event.target.value;
    this.salesData.calcAll();
    this.updateTableData();
  }

  oilProd(event: any) {
    this.salesData.oilProduction = event.target.value;
    this.salesData.calcAll();
    this.updateTableData();
  }

  oilHand(event: any) {
    this.salesData.oilOnHand = parseInt(event.target.value);
    this.salesData.calcAll();
    this.updateTableData();
  }

  foodHand(event: any) {
    this.salesData.foodOnHand = parseInt(event.target.value);
    this.salesData.calcAll();
    this.updateTableData();
  }

  turnHand(event: any) {
    let value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      this.salesData.setTurnsOnHand(value);
      this.updateTableData();
    } else {
      this.salesData.setTurnsOnHand(0);
      this.updateTableData();
    }
  }
  extractValuesold(event: any): any {
    const input = event.target.value;
    const extracted: any = {};

    // Money
    const moneyMatch = input.match(/Money:\s*\$([\d,]+)/);
    if (moneyMatch) extracted.money = +moneyMatch[1].replace(/,/g, '');

    // Food
    const foodMatch = input.match(/Food:\s*([\d,]+)\s*Bushels/);
    if (foodMatch) extracted.bushels = +foodMatch[1].replace(/,/g, '');

    // Oil
    const oilMatch = input.match(/Oil\s*([\d,]+)/);

    if (oilMatch) {
      extracted.oil = parseInt(oilMatch[1].replace(/,/g, ''), 10); // Removes commas and converts the extracted string value to a number
    }

    // Networth
    const networthMatch = input.match(/Networth:\s*\$([\d,]+)/);
    if (networthMatch) extracted.networth = +networthMatch[1].replace(/,/g, '');

    const foodProductionMatch = input.match(
      /Food\s*[\d,]+\s*Production\s*([\d,]+)/
    );

    if (foodProductionMatch) {
      extracted.bushelProduction = +foodProductionMatch[1].replace(/,/g, '');
    }

    const oilProductionMatch = input.match(
      /Oil\s*[\d,]+\s*Production\s*([\d,]+)/
    );

    if (oilProductionMatch) {
      extracted.oilProduction = +oilProductionMatch[1].replace(/,/g, '');
    }
    const turnsLeftMatch = input.match(/Turns Left\s*(\d+)/);

    if (turnsLeftMatch) {
      extracted.turnsLeft = +turnsLeftMatch[1].replace(/,/g, '');
    }

    const turnsStoredMatch = input.match(/Turns Stored\s*(\d+)/);

    if (turnsStoredMatch) {
      extracted.turnsStored = +turnsStoredMatch[1].replace(/,/g, '');
    }

    // ... (Continue for other values)
    console.log(extracted);
    return extracted;
  }

  extractValues(event: any): any {
    const input = event.target.value;
    const extracted: any = {};

    // Money
    const moneyMatch = input.match(/Money:\s*\$([\d,]+)/);
    if (moneyMatch)
      extracted.money = parseInt(moneyMatch[1].replace(/,/g, ''), 10);

    // Food
    const foodMatch = input.match(/Food:\s*([\d,]+)\s*Bushels/);
    if (foodMatch) {
      extracted.bushels = parseInt(foodMatch[1].replace(/,/g, ''), 10);
      this.foodHand({ target: { value: extracted.bushels } });
    }

    // Oil
    const oilMatch = input.match(/Oil\s*([\d,]+)/);
    if (oilMatch) {
      extracted.oil = parseInt(oilMatch[1].replace(/,/g, ''), 10);
      this.oilHand({ target: { value: extracted.oil } });
    }

    // Networth
    const networthMatch = input.match(/Networth:\s*\$([\d,]+)/);
    if (networthMatch)
      extracted.networth = parseInt(networthMatch[1].replace(/,/g, ''), 10);

    const foodProductionMatch = input.match(
      /Food\s*[\d,]+\s*Production\s*[\d,]+\s*Consumption\s*[\d,]+\s*Net Change\s*([\d,]+)/
    );

    if (foodProductionMatch) {
      extracted.bushelProduction = parseInt(
        foodProductionMatch[1].replace(/,/g, ''),
        10
      );
      this.foodProd({ target: { value: extracted.bushelProduction } });
    }

    const oilProductionMatch = input.match(
      /Oil\s*[\d,]+\s*Production\s*([\d,]+)/
    );
    if (oilProductionMatch) {
      extracted.oilProduction = parseInt(
        oilProductionMatch[1].replace(/,/g, ''),
        10
      );
      this.oilProd({ target: { value: extracted.oilProduction } });
    }

    const turnsLeftMatch = input.match(/Turns Left\s*(\d+)/);
    if (turnsLeftMatch)
      extracted.turnsLeft = parseInt(turnsLeftMatch[1].replace(/,/g, ''), 10);

    const turnsStoredMatch = input.match(/Turns Stored\s*(\d+)/);
    if (turnsStoredMatch)
      extracted.turnsStored = parseInt(
        turnsStoredMatch[1].replace(/,/g, ''),
        10
      );

    this.turnHand({
      target: { value: parseInt(extracted.turnsLeft + extracted.turnsStored) },
    });

    // ... (Continue for other values)
    console.log(extracted);
    return extracted;
  }
}

// En Route: 41,460,512 Bushels on sale for $36 each (Arrive in 4.2 hours)
// En Route: 3,710,260 Oil Barrels on sale for $114 each (Arrive in 4.3 hours)
