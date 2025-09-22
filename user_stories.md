- Índice
    - [Descrição do produto](#descrição-do-produto)
    - [Time](#time)
    - [Funcionalidade Essenciais e Estrutura do Sistema (MVP)](#funcionalidades-essenciais-e-estrutura-do-sistema-mvp)
        - [RF01 - Documentação e Infraestrutura Inicial do Projeto](#rf-01-documentação-e-infraestrutura-inicial-do-projeto)
        - [RF02 - Login](#rf-02-login)
        - [RF03 - Logout](#rf-03-logout)
        - [RF04 - Visualizar todas as mesas (Gerente)](#rf-04-visualizar-todas-as-mesas-gerente)
        - [RF05 - Alterar Estado das Mesas (Gerente)](#rf-05-alterar-estado-das-mesas-gerente)
        - [RF06 - Adicionar Novas Mesas](#rf-06-adicionar-novas-mesas)
        - [RF07 - Visualizar todas as mesas (Atendente)](#rf-07-visualizar-todas-as-mesas-atendente)
        - [RF08 - Adicionar Novas Mesas (Atendente)](#rf-08-adicionar-novas-mesas-atendente)
        - [RF09 - Barra de Navegação](#rf-09-barra-de-navegação)

    - [Gestão de Pedidos e Relatórios Diários](#gestão-de-pedidos-e-relatórios-diários)
        - [RF10 - Gerenciar Cardápio (Gerente)](#rf-10-gerenciar-cardápio-gerente)
        - [RF11 - Visualizar Pedidos de Uma Mesa (Atendente)](#rf-11-visualizar-pedidos-de-uma-mesa-atendente)
        - [RF12 - Criar, Editar, e Excluir Itens de Pedido (Atendente)](#rf-12-criar-editar-e-excluir-itens-de-pedido-atendente)
        - [RF13 - Visualizar Painel de Faturamento (Gerente)](#rf-13-visualizar-painel-de-faturamento-gerente)
        - [RF14 - Visualizar Histórico de Todos os Pedidos (Gerente)](#rf-14-visualizar-histórico-de-todos-os-pedidos-gerente)
        - [RF15 - Aba de Mesas Ocupadas (Atendente)](#rf-15-aba-de-mesas-ocupadas-atendente)
        - [RF16 - Visualizar Histórico Geral de Todos os Pedidos (Atendente)](#rf-16-visualizar-histórico-geral-de-todos-os-pedidos-atendente)

    - [Gestão de Funcionários e Sistema de Reservas](#gestão-de-funcionários-e-sistema-de-reservas)
        - [RF17 - Visualizar Todos os Atendentes](#rf-17-visualizar-todos-os-atendentes)
        - [RF18 - Cadastrar Novo Funcionário](#rf-18-cadastrar-novo-funcionário)
        - [RF19 - Reservar uma Mesa](#rf-19-reservar-uma-mesa)
        - [RF20 - Visualizar Mesas Disponíveis (Cliente)](#rf-20-visualizar-mesas-disponíveis-cliente)
        - [RF21 - Reservar Mesa (Cliente)](#rf-21-reservar-mesa-cliente)
        - [RF22 - Visualizar Mesas Reservadas (Atendente)](#rf-22-visualizar-mesas-reservadas-atendente)
        - [RF23: Visuializar Reservas Feitas (Atendente)](#rf-23-visuializar-reservas-feitas-atendente)

    - [Relatórios Avançados, Histórico e Interação com Clientes](#relatórios-avançados-histórico-e-interação-com-clientes)
        - [RF25 - Visualizar Faturamento e Pedidos de Dia Especifico (Gerente)](#rf-25-visualizar-faturamento-e-pedidos-de-dia-especifico-gerente)
        - [RF26 - Área de Faturamento com Gráficos e Relatórios (Gerente)](#rf-26-área-de-faturamento-com-gráficos-e-relatórios-gerente)
        - [RF27 - Itens do Painel como Links (Gerente)](#rf-27itens-do-painel-como-links-gerente)
        - [RF28 - Contato com Gerência (Atendente)](#rf-28-contato-com-gerência-atendente)
        - [RF29 - Verificar Estado da Mesa com QR Code (Cliente)](#rf-29-verificar-estado-da-mesa-com-qr-code-cliente)

## Descrição do produto

GestAly é plicativo para restaurantes que funciona como um cardápio digital interativo, permitindo que os clientes terem acesso a várias funcionalidades de atendimento.

## Time

### João Pedro Oliveira Barbosa - [@Iohanan-Cephas](https://github.com/Iohanan-Cephas)
### Marcus Vicinius Guimarães Balbino - [@Galessss](https://github.com/Galessss)
### Heitor Fernandes Carrijo - [@HeitorFernandes04](https://github.com/HeitorFernandes04)
### Lucas José de Sousa Gomes - [@yamatosz](https://github.com/yamatosz)
### Jonata Rubens Silva Araújo - [@JonataRubens](https://github.com/JonataRubens)

---

### [Projetos de Sistemas 2025/2](https://github.com/disciplinas-prof-Edeilson-UFT/proj-sist-2025-2) - Professor Edeilson

---

## Funcionalidades Essenciais e Estrutura do Sistema (MVP)

### RF-01: Documentação e Infraestrutura Inicial do Projeto

**Como** equipe de desenvolvimentos, **queremos** documentar e estruturar a base inicial do projeto **para** garantir organização, padronização e suporte para melhor desenvolvimento das próximas funcionalidades.

### RF-02: Login
**Como** usuário, **quero** realizar login e manter minha sessão ativa **para** acessar funcionalidades personalizadas do sistema.

### RF-03: Logout
**Como** usuário logado, **quero** realizar o logout **para** encerrar minha sessão de forma segura.

### RF-04: Visualizar todas as mesas (Gerente)
**Como** Gerente, **eu quero** visualizar todas as mesas do restaurante em uma única tela **para** ter umma visão geral completa do salão.

### RF-05: Alterar Estado das Mesas (Gerente)
**Como** Gerente, **eu quero** alterar o estado de uma mesa (Livre/Ocupada) **para** que o sistema reflita a situação real do restaurante. 

### RF-06: Adicionar Novas Mesas
**Como** Gerente, **eu quero** adicionar novas mesas ao sistema **para** poder atualizar o layout do salão quando necessário. 

### RF-07: Visualizar todas as mesas (Atendente)
**Como** Atendente, **eu quero** visualizar a lista de todas as mesas e seus status (disponível, ocupada, reservada) **para** saber onde posso acomodar novos clientes. 

### RF-08: Adicionar Novas Mesas (Atendente)
**Como** Atendente, **eu quero** poder alterar o estado de uma mesa (por exemplo, de reservada para ocupada) **para** manter o sistema atualizado. 

### RF-09: Barra de Navegação
**Como** Desenvolvedor, **eu quero** que a barra de navegação (navbar) seja um template base compartilhado em todas as telas de gerência **para** garantir consistência visual. 

## Gestão de Pedidos e Relatórios Diários

### RF-10: Gerenciar Cardápio (Gerente)
**Como** Gerente, **eu quero** poder gerenciar o cardápio do restaurante **para** adicionar, editar ou remover itens que são oferecidos aos clientes. 

### RF-11: Visualizar Pedidos de Uma Mesa (Atendente)
**Como** Atendente, **eu quero** visualizar os pedidos de uma mesa específica ao clicar em "detalhes" **para** saber o que os clientes consumiram. 

### RF-12: Criar, Editar, e Excluir Itens de Pedido (Atendente)
**Como** Atendente, **eu quero** poder criar, editar e excluir itens do pedido de uma mesa **para** gerenciar as solicitações dos clientes com precisão. 

### RF-13: Visualizar Painel de Faturamento (Gerente)
**Como** Gerente, **eu quero** visualizar no meu painel o faturamento, o total de pedidos e as mesas ocupadas no dia de hoje **para** avaliar rapidamente o desempenho diário. 

### RF-14: Visualizar Histórico de Todos os Pedidos (Gerente)
**Como** Gerente, **eu quero** ver o histórico de todos os pedidos realizados no dia **para** poder revisar a atividade recente. 

### RF-15: Aba de Mesas Ocupadas (Atendente)
**Como** Atendente, **eu quero** ter uma aba que mostre apenas as mesas ocupadas **para** focar meu atendimento nos clientes que já estão no local. 

### RF-16: Visualizar Histórico Geral de Todos os Pedidos (Atendente)
**Como** Atendente, **eu quero** visualizar um histórico geral de todos os pedidos já feitos **para** consultar transações passadas. 

## Gestão de Funcionários e Sistema de Reservas

### RF-17: Visualizar Todos os Atendentes
**Como** Gerente, **eu quero**  ver uma lista de todos os atendentes com seus nomes e matrículas **para** gerenciar minha equipe. 

### RF-18: Cadastrar Novo Funcionário
**Como** Gerente, **eu quero**  poder cadastrar um novo funcionário no sistema **para** que ele tenha acesso ao painel de atendente. 

### RF-19: Reservar uma Mesa
**Como** Atendente, **eu quero**  poder reservar uma mesa **para** um cliente para garantir o lugar dele. 

### RF-20: Visualizar Mesas Disponíveis (Cliente)
**Como** Cliente, **eu quero**  ver no aplicativo se há mesas disponíveis no restaurante **para** decidir se vale a pena ir. 

### RF-21: Reservar Mesa (Cliente)
**Como** Cliente, **eu quero**  poder fazer uma reserva de mesa através do aplicativo **para** garantir meu lugar com antecedência. 

### RF-22: Visualizar Mesas Reservadas (Atendente)
**Como** Atendente, **eu quero**  visualizar uma lista de mesas reservadas **para** gerenciar as chegadas dos clientes. 

### RF-23: Visuializar Reservas Feitas (Atendente)
**Como** Atendente, **eu quero**  saber se uma reserva foi feita por um colega ou pelo cliente no aplicativo **para** ter o contexto da situação. 

### RF-24: Ler QR Code (Cliente) [Feature Futura]
**Como** Cliente, **eu quero**  que o aplicativo tenha um botão "Ler QR Code" **para** futuras interações com a mesa. 

## Relatórios Avançados, Histórico e Interação com Clientes

### RF-25: Visualizar Faturamento e Pedidos de Dia Especifico (Gerente)
**Como** Gerente, **eu quero** poder selecionar um dia anterior **para** visualizar o faturamento e os pedidos daquela data, assim como faço para o "Dia de Hoje". 

###	RF-26: Área de Faturamento com Gráficos e Relatórios (Gerente)
**Como** Gerente, **eu quero** ter uma área de "Faturamento" com gráficos e relatórios **para** analisar todas as informações financeiras do restaurante. 

### RF-27: Itens do Painel como Links (Gerente)
**Como** Gerente, **eu quero** que os itens do painel "Dia de Hoje" (faturamento, pedidos, etc.) sejam links que me levem **para** telas com mais detalhes. 

### RF-28: Contato com Gerência (Atendente)
**Como** Atendente, **eu quero** ter uma opção de contato com a gerência **para** abrir um chamado caso precise relatar algum problema ou fazer uma solicitação. 

### RF-29: Verificar Estado da Mesa com QR Code (Cliente)
**Como** Cliente (Feature Futura), **eu quero** escanear o QR Code de uma mesa **para** verificar se ela está livre e ocupá-la diretamente pelo aplicativo. 