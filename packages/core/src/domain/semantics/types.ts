export type SemanticThreshold<TLabel extends string = string> = {
  rank: number;
  min: number;
  label: TLabel;
  description: string;
};

export type SemanticValue<TKey extends string = string, TLabel extends string = string> = {
  key: TKey;
  value: number;
  label: TLabel;
  rank: number;
  description: string;
};
