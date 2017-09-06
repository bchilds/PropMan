import { getDays } from '../../src/components/Payment/formHelperData'

describe('Addition', () => {
  it('knows that 2 and 2 make 4', () => {
    expect(2 + 2).toBe(4);
  });
});

describe('Get days', () => {
  it('knows there are 31 days', () => {
    expect(getDays().length).toBe(31);
  });
})