import { AuthErrorsPipe } from './auth-errors.pipe';

describe('AuthErrorsPipe', () => {
  it('create an instance', () => {
    const pipe = new AuthErrorsPipe();
    expect(pipe).toBeTruthy();
  });
});
