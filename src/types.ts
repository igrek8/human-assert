export interface Program {
  type: 'Program';
  body: ExpressionStatement;
}

export interface ExpressionStatement {
  type: 'ExpressionStatement';
  expression: LogicalExpression | UnaryExpression | AssertionExpression;
}

export interface LogicalExpression {
  type: 'LogicalExpression';
  operator: 'and' | 'or' | 'xor';
  left: UnaryExpression | AssertionExpression;
  right: ExpressionStatement;
}

export interface UnaryExpression {
  type: 'UnaryExpression';
  argument: ExpressionStatement | AssertionExpression;
}

export interface AssertionExpression {
  type: 'AssertionExpression';
  operator: 'in';
  left: string;
  right: string;
}
