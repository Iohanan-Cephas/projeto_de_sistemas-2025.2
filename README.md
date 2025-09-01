# Projeto

## 📌 Informações Acadêmicas

- **Instituição**: Universidade Federal do Tocantins  
- **Curso**: Ciência da Computação  
- **Disciplina**: Projeto de Sistemas  
- **Professor**: Edeilson Milhomem da Silva  
- **Equipe**:  
  - [João Pedro Oliveira Barbosa ](https://github.com/Iohanan-Cephas) 
  - [Marcus Vinicius Guimarães Balbino](https://github.com/Galessss)  
  - [Heitor Fernandes Carrijo](https://github.com/HeitorFernandes04)  
  - [Lucas José de Sousa Gomes](https://github.com/yamatosz)  
  - [Jonata Rubens Silva Araújo](https://github.com/JonataRubens)  

---

## 🍽️ Sobre o Projeto

O projeto consiste no desenvolvimento de um **aplicativo para restaurantes** que funciona como um **cardápio digital interativo**, permitindo que os clientes:  

- Consultem o menu de forma prática e intuitiva.  
- Realizem pedidos diretamente pelo aplicativo.  
- Acompanhem em tempo real o status do pedido.  
- Efetuem o pagamento pelo próprio app.  

Além disso, o sistema busca **reduzir falhas no atendimento**, **agilizar processos internos** e **otimizar a experiência do cliente**, tornando o serviço mais rápido e eficiente tanto para consumidores quanto para restaurantes.  

---

## 📖 Fundamentação

Na vida moderna, marcada pela busca por praticidade e agilidade, o setor de restaurantes enfrenta desafios para atender às demandas de consumidores cada vez mais exigentes. Nesse contexto, soluções digitais se tornam estratégicas para otimizar processos internos e melhorar a experiência do cliente.  

A automação digital aplicada ao setor gastronômico impacta diretamente três pilares essenciais:  

1. **Receita**  
2. **Custos operacionais**  
3. **Qualidade no atendimento**  

Enquanto os modelos tradicionais dependem de anotações manuais, comunicação presencial e controles fragmentados, o uso de aplicativos proporciona:  

- Pedidos automáticos.  
- Integração com sistemas de pagamento.  
- Relatórios e métricas em tempo real.  
---

## Protótipo e Sprints
**🎨 [Protótipo no Figma](https://www.figma.com/proto/kDv15u1yahVo1VEOCYTnwy/Untitled?node-id=0-1&t=JcpbYVpp2r6ag0Jv-1)**

**📄 [Documentação das sprints e atribuições da equipe](https://github.com/Iohanan-Cephas/projeto_de_sistemas-2025.2/tree/develop)**

---
## 🗣️ Meios de comunicação e organização da equipe
* [Trello](https://trello.com/invite/b/68b43f6b90e39ccece65a951/ATTIbeba4551099ef326e3c14f4d15e4b57fC0D0343E/projeto-de-sistemas-20252)
* Grupo de Whatsapp
* Github
---

## 🛠️ Stack Tecnológica
| Área                 | Tecnologia                |
|----------------------|---------------------------|
| Front/Back-end       | Django                    |
| Mobile               | Ionic                     |
| Banco de Dados       | SQLite                    |
| Versionamento        | GitHub                    |

---

## 📋 Requisitos Funcionais

### 📦 RF-01: Documentação e Infraestrutura Inicial do Projeto

**User Story**:
"Como equipe de desenvolvimento, queremos documentar e estruturar a base inicial do projeto para garantir organização, padronização e suporte para melhor desenvolvimento das próximas funcionalidades."

**📝 Regras de Negócio**:

- O projeto deve possuir um README claro, descrevendo objetivo, equipe e instruções básicas.
- Deve existir um repositório no GitHub configurado para versionamento.
- Estrutura de pastas padronizada para código, documentação e testes.
- A aplicação deve ser feita em django e ionic.
- Documentação inicial do projeto.

### 📦 RF-02: Lógica de Login e Sessão

**User Story**:
"Como usuário, quero realizar login e manter minha sessão ativa para acessar funcionalidades personalizadas do sistema."

**📝 Regras de Negócio**:

- O login deve ser feito com e-mail e senha cadastrados.
- Senha deve possuir no mínimo 8 caracteres.
- Deve ser possível sair (logout) a qualquer momento.
- Sessão do usuário deve expirar automaticamente após tempo de inatividade (ex.: 30 min).

--- 
**🚀 Como rodar o projeto**

O sistema é composto por duas partes:

Backend: API em Django

Frontend: Aplicação web/mobile em Ionic

**🔧 Pré-requisitos**

Python 3.11+

Node.js 18+ / npm ou yarn

▶️ Rodando manualmente
```bash
Backend (Django)
cd backend
python -m venv .venv
source .venv/bin/activate  # ou .venv\Scripts\activate no Windows

pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver


API em: http://localhost:8000

Frontend (Ionic)
cd frontend
npm install
ionic serve

App em: http://localhost:8100
```

