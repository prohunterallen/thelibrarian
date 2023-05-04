import { JwtService } from '@nestjs/jwt';

export class APIFeatureUtility {
  static async assignJwtToken(
    userId: string,
    jwtService: JwtService,
  ): Promise<string> {
    const payload = { userId: userId };
    return jwtService.sign(payload);
  }
}
