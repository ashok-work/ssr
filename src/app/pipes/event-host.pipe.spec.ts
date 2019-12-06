import { EventHostPipe } from './event-host.pipe';

describe('EventHostPipe', () => {
  it('create an instance', () => {
    const pipe = new EventHostPipe();
    expect(pipe).toBeTruthy();
  });
});
