{
  function program(body) {
    return { type: "Program", body };
  }

  function unary(argument) {
    return { type: "UnaryExpression", argument };
  }

  function logical_expression(left, operator, right) {
    return { type: "LogicalExpression", operator, right, left };
  }

  function assertion_group(items, operator, right, negate) {
    return items.reduce((assert1, assert2, index) => {
      if (index === 1) {
        return logical_expression(
          assertion(assert1, operator, right, negate),
          "and",
          assertion(assert2, operator, right, negate)
        );
      }
      return logical_expression(
        assert1,
        "and",
        assertion(assert2, operator, right, negate)
      );
    });
  }

  function make_expression(expression) {
    return { type: "ExpressionStatement", expression };
  }

  function assertion(left, operator, right, negate) {
    const assert = { type: "AssertionExpression", operator, left, right };
    return negate ? unary(assert) : assert;
  }
}

Program
 = body: ExpressionStatement { return program(body) }

ExpressionStatement
 = expression: LogicalExpression { return make_expression(expression) }
 / expression: Operand { return make_expression(expression) }

LogicalExpression
 = left: Operand _ operator: LogicalOperator _ right: ExpressionStatement { return logical_expression(left, operator, right.expression) }

Operand
 = UnaryExpression
 / WrappedExpression
 / AssertionExpression

WrappedExpression
 = '(' expression: ExpressionStatement ')' { return expression }

UnaryExpression
 = UnaryOperator _ '(' argument: ExpressionStatement ')' { return unary(argument) }

LogicalOperator
 = 'and' / 'or' / 'xor'

UnaryOperator
 = 'not'

AssertionExpression
 = left: AssertionGroup unary: (_ UnaryOperator)? _ operator: AssertionOperator _ right: Literal {  return assertion_group(left, operator, right, Boolean(unary)) }
 / left: Literal unary: (_ UnaryOperator)? _ operator: AssertionOperator _ right: Literal { return assertion(left, operator, right, Boolean(unary)) }

AssertionGroup
 = '(' first: Literal tail: (_ match: Literal { return match })+ ')' { return [first, ...tail] }

AssertionOperator
 = 'in'

Literal
 = [^( ,)]+ { return text() }

_
 = ' '