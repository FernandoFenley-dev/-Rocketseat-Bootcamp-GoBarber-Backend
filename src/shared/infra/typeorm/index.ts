import { createConnections } from 'typeorm';

// função procura arquivo "ormconfig.json" para fazer a conexao com o BD
// poderiamos passar os mesmos parâmetros de configuração do arquivo ormconfig.json" dentro da função
// createConnection(); -- Para fazer apenas a conexao com o postgres

createConnections(); // Para fazer apenas a conexao com o mongodb
