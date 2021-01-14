import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

export default class FakeHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    // como os testes mão é necessário gravar a senha criptografada,
    // é como se, nos testes, não estivessemos fazendo o hash
    return payload;
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }
}
