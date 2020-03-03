import { TestBed } from '@angular/core/testing';

import { SetHeaderService } from './set-header.service';

describe('SetHeaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetHeaderService = TestBed.get(SetHeaderService);
    expect(service).toBeTruthy();
  });
});
