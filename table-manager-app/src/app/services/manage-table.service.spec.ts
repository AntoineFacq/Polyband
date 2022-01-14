import { TestBed } from '@angular/core/testing';

import { ManageTableService } from './manage-table.service';

describe('ManageTableService', () => {
  let service: ManageTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
