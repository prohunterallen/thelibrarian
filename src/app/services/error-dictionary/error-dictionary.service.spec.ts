import { Test, TestingModule } from '@nestjs/testing';
import { ErrorDictionaryService } from './error-dictionary.service';

describe('ErrorDictionaryService', () => {
  let service: ErrorDictionaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorDictionaryService],
    }).compile();

    service = module.get<ErrorDictionaryService>(ErrorDictionaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
