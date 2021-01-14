export default interface ICacheProvider {
  save(key: string, value: any): Promise<void>;
  // para tipar o tipo de retorno na consulta ao Redis,
  // utiizamos <T> para informar que ele pode receber qualquer tipo de objeto na consulta
  recover<T>(key: string): Promise<T | null>;
  invalidate(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
}
