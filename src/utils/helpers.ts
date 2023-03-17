import bcrypt from "bcrypt";

export function getRandomFourDigitNumber(): number {
  return Math.floor(1000 + Math.random() * 9000);
}

export function hashPassword(password: string) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  return hashedPassword;
}

export function compareHash(hash: string, rawPassword: string) {
  const passwordComparison = bcrypt.compareSync(rawPassword, hash);
  return passwordComparison;
}
