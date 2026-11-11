// CLASSE: representa um cliente do sistema.

class Cliente {

  constructor(id, nome, email, telefone, cidade) {

    this.id = id;

    this.nome = nome;

    this.email = email;

    this.telefone = telefone;

    this.cidade = cidade;

  }

 

  atualizar(nome, email, telefone, cidade) {

    this.nome = nome;

    this.email = email;

    this.telefone = telefone;

    this.cidade = cidade;

  }

}

 

// CLASSE: concentra as operações de gerenciamento dos clientes.

class CadastroClientes {

  constructor() {

    this.clientes = this.carregar();

  }

 

  carregar() {

    const dados = JSON.parse(localStorage.getItem("clientes")) || [];

    return dados.map(item => new Cliente(

      item.id, item.nome, item.email, item.telefone, item.cidade

    ));

  }

 

  salvarNoNavegador() {

    localStorage.setItem("clientes", JSON.stringify(this.clientes));

  }

 

  adicionar(cliente) {

    this.clientes.push(cliente);

    this.salvarNoNavegador();

  }

 

  buscarPorId(id) {

    return this.clientes.find(cliente => cliente.id === id);

  }

 

  atualizar(id, dados) {

    const cliente = this.buscarPorId(id);

    if (!cliente) return false;

 

    cliente.atualizar(

      dados.nome, dados.email, dados.telefone, dados.cidade

    );

    this.salvarNoNavegador();

    return true;

  }

 

  excluir(id) {

    this.clientes = this.clientes.filter(cliente => cliente.id !== id);

    this.salvarNoNavegador();

  }

}

 

const cadastro = new CadastroClientes();

const formulario = document.getElementById("formCliente");

const lista = document.getElementById("listaClientes");

const pesquisa = document.getElementById("pesquisa");

const mensagemVazia = document.getElementById("mensagemVazia");

 

function limparFormulario() {

  formulario.reset();

  document.getElementById("clienteId").value = "";

  document.getElementById("btnSalvar").textContent = "Salvar cliente";

}

 

function renderizarClientes(filtro = "") {

  lista.innerHTML = "";

  const termo = filtro.toLowerCase();

 

  const clientesFiltrados = cadastro.clientes.filter(cliente =>

    cliente.nome.toLowerCase().includes(termo) ||

    cliente.email.toLowerCase().includes(termo)

  );

 

  mensagemVazia.hidden = clientesFiltrados.length > 0;

 

  clientesFiltrados.forEach(cliente => {

    const linha = document.createElement("tr");

 

    // textContent evita inserir os dados digitados como código HTML.

    [cliente.nome, cliente.email, cliente.telefone, cliente.cidade]

      .forEach(valor => {

        const celula = document.createElement("td");

        celula.textContent = valor || "-";

        linha.appendChild(celula);

      });

 

    const acoes = document.createElement("td");

 

    const btnEditar = document.createElement("button");

    btnEditar.textContent = "Editar";

    btnEditar.className = "editar";

    btnEditar.type = "button";

    btnEditar.addEventListener("click", () => carregarParaEdicao(cliente.id));

 

    const btnExcluir = document.createElement("button");

    btnExcluir.textContent = "Excluir";

    btnExcluir.className = "excluir";

    btnExcluir.type = "button";

    btnExcluir.addEventListener("click", () => {

      if (confirm("Deseja realmente excluir este cliente?")) {

        cadastro.excluir(cliente.id);

        renderizarClientes(pesquisa.value);

      }

    });

 

    acoes.append(btnEditar, btnExcluir);

    linha.appendChild(acoes);

    lista.appendChild(linha);

  });

}

 

function carregarParaEdicao(id) {

  const cliente = cadastro.buscarPorId(id);

  if (!cliente) return;

 

  document.getElementById("clienteId").value = cliente.id;

  document.getElementById("nome").value = cliente.nome;

  document.getElementById("email").value = cliente.email;

  document.getElementById("telefone").value = cliente.telefone;

  document.getElementById("cidade").value = cliente.cidade;

  document.getElementById("btnSalvar").textContent = "Atualizar cliente";

  document.getElementById("nome").focus();

}

 

formulario.addEventListener("submit", event => {

  event.preventDefault();

 

  const id = document.getElementById("clienteId").value;

  const dados = {

    nome: document.getElementById("nome").value.trim(),

    email: document.getElementById("email").value.trim(),

    telefone: document.getElementById("telefone").value.trim(),

    cidade: document.getElementById("cidade").value.trim()

  };

 

  if (!dados.nome || !dados.email) {

    alert("Preencha o nome e o e-mail.");

    return;

  }

 

  if (id) {

    cadastro.atualizar(id, dados);

    alert("Cliente atualizado com sucesso!");

  } else {

    const novoCliente = new Cliente(

      Date.now().toString(),

      dados.nome, dados.email, dados.telefone, dados.cidade

    );

    cadastro.adicionar(novoCliente);

    alert("Cliente cadastrado com sucesso!");

  }

 

  limparFormulario();

  renderizarClientes(pesquisa.value);

});

 

document.getElementById("btnLimpar").addEventListener("click", limparFormulario);

pesquisa.addEventListener("input", () => renderizarClientes(pesquisa.value));

 

// Exibe os registros que já estavam salvos no navegador.

renderizarClientes();