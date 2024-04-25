var bcrypt = require('bcryptjs');

export class HashService {
  private saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    let hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return hashedPassword;
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
