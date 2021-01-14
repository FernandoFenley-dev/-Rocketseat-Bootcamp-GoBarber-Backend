import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    // rename(): altera um arquivo de um diretório para outro
    // estamos movendo da pasta 'tmp' para a pasta 'upload'
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file),
    );
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    // caminho do arquivo salvo na pasta 'uploads'
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);

    // apenas deletaremos o arquivo se ele existir
    try {
      // forma de verificar se o arquivo existe no Node
      // .stat() => trazer os dados do arquivo, mas se ele der error quer dizer que nao encontrou
      await fs.promises.stat(filePath);
    } catch (error) {
      // se der error, significa que nao encontrou o arquivo
      // portanto, não precisa fazer nada
      return;
    }

    // excluindo o arquivo
    await fs.promises.unlink(filePath);
  }
}

export default DiskStorageProvider;
