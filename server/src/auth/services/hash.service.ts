import * as bcrypt from 'bcrypt';

export class HashService {
  private saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    let hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return hashedPassword;
  }
}
