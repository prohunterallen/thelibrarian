import { Test, TestingModule } from '@nestjs/testing';
import { HttpErrorDictionaryService } from './http-error-dictionary.service';

describe('HttpErrorDictionaryService', () => {
  let service: HttpErrorDictionaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpErrorDictionaryService],
    }).compile();

    service = module.get<HttpErrorDictionaryService>(
      HttpErrorDictionaryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
