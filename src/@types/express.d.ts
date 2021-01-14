// sobrescrevendo uma tipagem do express
declare namespace Express {
  // sobrescrevendo a declaração do objeto REQUEST do Express e anexando novas
  // propriedades ao objeto
  export interface Request {
    // adicionando um objeto 'user'
    user: {
      id: string;
    };
  }
}
