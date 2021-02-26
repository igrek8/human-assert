import { compile } from './compile';

describe('compile', () => {
  it('compiles valid expressions', () => {
    expect(() => compile({ source: 'a in b' })).not.toThrowError();
  });

  it('fails to compile empty expression', () => {
    expect(() => compile({ source: '' })).toThrowError();
  });

  it('fails to compile invalid expression', () => {
    expect(() => compile({ source: 'b has a' })).toThrowError();
  });
});
