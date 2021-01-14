export default interface IHashProvider {
  generateHash(payload: string): Promise<string>;
  compareHash(payload: string, heshed: string): Promise<boolean>;
}
