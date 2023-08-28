import {compare, hash} from 'bcryptjs';

export class BcryptService {

  async compareHash(value: string, hash: string) {
    return compare(
      value,
      hash,
    );
  }

  async generateHash(value: string) {
    return hash(value, 10)
  }

}
