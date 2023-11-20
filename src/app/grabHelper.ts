export class GrabHelper {
  private validKeys = [
    'Rank',
    'CountryName',
    'Number',
    'Land',
    'Networth',
    'Gov',
    'SSReturn',
    'BotType',
    'DR',
    'CCDR',
    'EstSSBreak',
    'AcresPerTurn',
  ];

  processGrabInfo(pastedText: string, bpt: number): (TableData | null)[] {
    const startMarker =
      'Rank\tCountry Name\tNumber\tLand\tNetworth\tGov\tSS Return\tBot Type\tDR\tC:C DR\tEst. SS Break';
    const endMarker = 'Designed with'; // or another unique line marking the end of the table

    // Find the start and end indices of the table data
    const startIndex = pastedText.indexOf(startMarker);
    const endIndex = pastedText.indexOf(endMarker, startIndex);

    // Extract the table data
    const tableText = pastedText.substring(startIndex, endIndex);
    let lines = tableText.split('\n');
    let headers = lines[0]
      .split('\t')
      .map((header) => this.formatHeader(header));
    let data: (TableData | null)[] = lines.slice(1).map((line) => {
      let values = line.split('\t');
      if (values.length < 5) {
        return null;
      }
      let obj: Partial<TableData> = {};
      values.forEach((value, index) => {
        let key = headers[index];
        debugger;
        if (this.isKeyOfTableData(key)) {
          if (key === 'SSReturn' || key === 'Land') {
            obj[key] = this.parseNumber(value);
          } else {
            obj[key] = this.inferType(value);
          }
        }
      });

      obj = this.getAcresPerTurn(obj, bpt);

      return obj as TableData;
    });

    // console.log('Data before sorting:', data);
    data.sort((a, b) => b?.AcresPerTurn! - a?.AcresPerTurn!);
    // console.log('Data after sorting:', data);

    return data;
  }
  getAcresPerTurn(obj: Partial<TableData>, bpt: number): Partial<TableData> {
    if (obj.BotType === 'Farmer') {
      let estimatedLandGrabbed = obj.SSReturn!;
      estimatedLandGrabbed -= 30;
      const estimatedFarms = estimatedLandGrabbed * 0.25;
      obj.AcresPerTurn = this.getOneAcresPerTurn(
        estimatedLandGrabbed,
        estimatedFarms,
        bpt
      );
      obj.SSReturn = estimatedLandGrabbed;
      return obj;
    }
    let estimatedLandGrabbed = obj.SSReturn!;
    if (obj.BotType === 'Indy') {
      estimatedLandGrabbed -= 100;
    } else if (obj.BotType === 'Casher') {
      estimatedLandGrabbed -= 60;
    }
    obj.SSReturn = estimatedLandGrabbed;
    const estimatedFarms = 0;

    obj.AcresPerTurn = this.getOneAcresPerTurn(
      estimatedLandGrabbed,
      estimatedFarms,
      bpt
    );
    return obj;
  }
  private getOneAcresPerTurn(
    estimatedLandGrabbed: number,
    estimatedFarms: number,
    bpt: number
  ) {
    const toBuild = estimatedLandGrabbed - estimatedFarms;
    const turnsToUse = 2 + toBuild / bpt; 

    const acresPerTurn = Math.round(estimatedLandGrabbed / turnsToUse);
    return acresPerTurn;
  }

  private isKeyOfTableData(key: string): key is keyof TableData {
    return this.validKeys.includes(key);
  }
  private parseNumber(value: string): number {
    return Number(value.replace(/[^0-9.]/g, ''));
  }

  private inferType(value: string): any {
    if (!isNaN(Number(value)) && value.trim() !== '') return Number(value);
    return value;
  }
  private formatHeader(header: string): string {
    return header.replace(/[ .:]/g, ''); // Removes periods and spaces
  }
}

export type TableData = {
  Rank: number;
  CountryName: string;
  Number: number;
  Land: number;
  Networth: string;
  Gov: string;
  SSReturn: number;
  BotType: BotType;
  DR: number;
  CCDR: number;
  EstSSBreak: number;
  AcresPerTurn?: number;
};

export type BotType = 'Farmer' | 'Casher' | 'Rainbow' | 'Indy' | 'Techer';
