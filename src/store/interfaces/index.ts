export interface CompsItem {
  o: string;
  comp: string;
  name: string;
  title: string;
  type?: string;
  width: number;
}
export interface CompsTree {
  name?: string;
  type: string;
  children: CompsItem[];
}

export interface Option {
  key?: string | number;
  label?: string;
}


export interface Duration {
  start: Date;
  end: Date;
  step: string;
}
export interface DurationTime {
  start: string;
  end: string;
  step: string;
}

export interface Trace {
  duration: number;
  isError: boolean;
  key: string;
  operationNames: string[];
  start: string;
  traceIds: string[];
}

export interface Span {
  duration: number;
  isError: boolean;
  key: string;
  operationNames: string[];
  start: string;
  traceIds: string[];
}
