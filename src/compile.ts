import { parse } from './parser';
import { Program } from './types';

export interface CompileOptions {
  source: string;
}

export function compile({ source }: CompileOptions) {
  return parse(source) as Program;
}
