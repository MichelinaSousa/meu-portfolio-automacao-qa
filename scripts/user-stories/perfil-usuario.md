# História de Usuário: Visualização e Edição de Perfil

**Como** usuário autenticado,
**Quero** acessar e atualizar meu perfil,
**Para** manter meus dados cadastrais corretos.

## Critérios de Aceite

- CA01: Ao acessar "My Account", vejo meu nome e e-mail cadastrados
- CA02: Posso navegar até a seção de edição do meu perfil
- CA03: Após fazer logout, não consigo acessar a área de perfil sem autenticar novamente
- CA04: O nome exibido no menu reflete o nome cadastrado (Jack Howe)
- CA05: A página de conta exibe o título "My account"

## Contexto Técnico

- URL da área autenticada: https://practicesoftwaretesting.com/account
- Autenticação **obrigatória** — usar `USUARIOS.valido` das fixtures
- Page Objects: `LoginPage`, `DashboardPage`
- Credenciais demo: customer2@practicesoftwaretesting.com / welcome01
