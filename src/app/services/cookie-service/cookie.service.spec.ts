import { TestBed, inject } from '@angular/core/testing';

import { CookieDataService } from './cookie.service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CookieDataService]
    });
  });

  it('should be created', inject([CookieDataService], (service: CookieDataService) => {
    expect(service).toBeTruthy();
  }));
});
