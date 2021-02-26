import { compile } from './compile';
import { resolve, Context } from './resolve';

const $ = (source: string, context: Context) => expect(resolve(compile({ source }), context));

describe('resolve', () => {
  it('match', () => $('a in b', { b: ['a'] }).toBe(true));
  it('no match', () => $('a in b', { b: [] }).toBe(false));

  it('negated no match', () => $('a not in b', { b: [] }).toBe(true));
  it('negated match', () => $('a not in b', { b: ['a'] }).toBe(false));

  it('negated expression no match', () => $('not (a in b)', { b: [] }).toBe(true));
  it('negated expression match', () => $('not (a in b)', { b: ['a'] }).toBe(false));

  it('and full match', () => $('a in b and c in d', { b: ['a'], d: ['c'] }).toBe(true));
  it('and partial match', () => $('a in b and c in d', { b: ['a'], d: [] }).toBe(false));

  it('or partial match', () => $('a in b or c in d', { b: ['a'], d: [] }).toBe(true));
  it('or no match', () => $('a in b or c in d', { b: [], d: [] }).toBe(false));

  it('xor partial match', () => $('a in b xor c in d', { b: ['a'], d: [] }).toBe(true));
  it('xor full match', () => $('a in b xor c in d', { b: ['a'], d: ['c'] }).toBe(false));

  it('wrap expressions', () => $('((a in b) and (c in d))', { b: ['a'], d: ['c'] }).toBe(true));

  it('wrap expressions', () => $('((a in b) and (c in d))', { b: ['a'], d: ['c'] }).toBe(true));

  it('shorthand full match', () => $('(a b c) in d', { d: ['a', 'b', 'c'] }).toBe(true));
  it('shorthand partial match', () => $('(a b c) in d', { d: ['a'] }).toBe(false));

  it('negated shorthand full match', () => $('(a b) not in c', { c: [] }).toBe(true));
  it('negated shorthand partial match', () => $('(a b) not in c', { c: ['a'] }).toBe(false));

  it('glob match', () => $('* in b', { b: ['a'] }).toBe(true));
  it('glob match no match', () => $('* in b', { b: [] }).toBe(false));
  it('glob match glob', () => $('* in b', { b: ['*'] }).toBe(true));

  it('nested glob match', () => $('a:* in b', { b: ['a:a'] }).toBe(true));
  it('nested glob no match', () => $('a:* in b', { b: ['b:b'] }).toBe(false));

  it('false match for unknown', () => expect(resolve({} as any, {})).toBe(false));

  describe('examples', () => {
    it('scenario 1', () => {
      const rule = '(customers in groups and owner in scopes) or (admin in roles)';
      $(rule, { roles: ['admin'] }).toBe(true);
      $(rule, { scopes: ['owner'], groups: ['customers'] }).toBe(true);
      $(rule, { groups: ['customers'] }).toBe(false);
    });

    it('scenario 2', () => {
      const rule = 'not (blocked in groups) and read:comments in permissions';
      $(rule, { permissions: ['read:comments'] }).toBe(true);
      $(rule, { groups: ['blocked'], permissions: ['read:comments'] }).toBe(false);
    });

    it('scenario 3', () => {
      const rule = '*:posts in permissions';
      $(rule, { permissions: ['read:posts', 'read:comments'] }).toBe(true);
    });
  });
});
