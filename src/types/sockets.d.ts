export interface BookInterface {
  BTCUSD: {
    bids: Order[];
    asks: Order[];
  };
  ETHUSD: {
    bids: Order[];
    asks: Order[];
  };
}

export type Order = [number, number, number];
