/**
 * Fixtures de dados para os testes
 * Site demo: https://practicesoftwaretesting.com
 * Usuários pré-cadastrados disponíveis no ambiente de demo
 */

export const USUARIOS = {
  valido: {
    email: 'customer2@practicesoftwaretesting.com',
    senha: 'welcome01',
    nome: 'Jack Howe',
  },
  admin: {
    email: 'admin@practicesoftwaretesting.com',
    senha: 'welcome01',
    nome: 'admin',
  },
  invalido: {
    email: 'usuario-invalido@teste.com',
    senha: 'senha-errada',
  },
  semSenha: {
    email: 'customer@practicesoftwaretesting.com',
    senha: '',
  },
  semEmail: {
    email: '',
    senha: 'welcome01',
  },
};
