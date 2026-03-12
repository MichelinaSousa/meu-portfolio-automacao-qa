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
    email: 'customer2@practicesoftwaretesting.com',
    senha: '',
  },
  semEmail: {
    email: '',
    senha: 'welcome01',
  },
};

export const PRODUTOS = {
  principal: {
    nome: 'Combination Pliers',
    quantidadeInicial: 1,
    quantidadeAtualizada: 2,
  },
  inexistente: {
    nome: 'Produto inexistente automacao qa xyz',
  },
};

export const ENDERECO_CHECKOUT = {
  street: 'Rua das Flores, 123',
  city: 'Cabo Frio',
  state: 'Rio de Janeiro',
  country: 'Brasil',
  postalCode: '28900-000',
};

export const PAGAMENTO_CHECKOUT = {
  metodo: 'cash-on-delivery',
};
