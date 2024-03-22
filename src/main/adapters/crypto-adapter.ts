import * as crypto from 'crypto';

import { Hasher } from '../../core/domain/protocols';

export class CryptoAdapter implements Hasher {
  constructor(private readonly secret: string) {}

  async hash(plaintext: string): Promise<string> {
    return crypto
      .createHmac('sha256', this.secret)
      .update(plaintext)
      .digest('base64');
  }
}
