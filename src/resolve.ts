import match from 'minimatch';

import { Program, ExpressionStatement, LogicalExpression, UnaryExpression, AssertionExpression } from './types';

export interface Context {
  [id: string]: string[];
}

const bool = (v: boolean) => v === true;

export function resolve(
  node: Program | ExpressionStatement | LogicalExpression | UnaryExpression | AssertionExpression,
  context: Context
): boolean {
  if (node.type === 'Program') {
    return bool(resolve(node.body, context));
  }
  if (node.type === 'ExpressionStatement') {
    return bool(resolve(node.expression, context));
  }
  if (node.type === 'AssertionExpression') {
    const target = context[node.right];
    const pattern = node.left;
    return bool(Array.isArray(target) && target.some((str) => typeof str === 'string' && match(str, pattern)));
  }
  if (node.type === 'UnaryExpression') {
    return !bool(resolve(node.argument, context));
  }
  if (node.type === 'LogicalExpression') {
    if (node.operator === 'and') {
      return bool(resolve(node.left, context)) && bool(resolve(node.right, context));
    }
    if (node.operator === 'or') {
      return bool(resolve(node.left, context)) || bool(resolve(node.right, context));
    }
    if (node.operator === 'xor') {
      return bool(resolve(node.left, context)) !== bool(resolve(node.right, context));
    }
  }
  return false;
}
