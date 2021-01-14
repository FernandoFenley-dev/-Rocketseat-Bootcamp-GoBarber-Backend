class Error {
  // parametro readonly nao permite alteração do valor do atributo
  // NAO é possivel fazer: error.message = 'error'
  public readonly message: string;

  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default Error;
