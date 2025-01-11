import * as bcrypt from 'bcrypt';
export async function generateHash(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}
export async function comparePassword(
  oldPassword: string,
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(oldPassword, password);
}
