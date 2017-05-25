import { WAVEPAYROLLREPORTPage } from './app.po';

describe('wave-payroll-report App', () => {
  let page: WAVEPAYROLLREPORTPage;

  beforeEach(() => {
    page = new WAVEPAYROLLREPORTPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
