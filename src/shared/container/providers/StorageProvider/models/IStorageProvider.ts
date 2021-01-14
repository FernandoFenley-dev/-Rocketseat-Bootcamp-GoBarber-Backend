export default interface IStorageProvider {
  saveFile(file: string): Promise<string>;
  deleteFile(fifle: string): Promise<void>;
}
