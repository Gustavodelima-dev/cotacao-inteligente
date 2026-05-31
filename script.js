let precos = JSON.parse(localStorage.getItem("precos")) || [];

window.onload = () => {
  if (localStorage.getItem("logado") === "true") {
    document.getElementById("loginTela").style.display = "none";
    document.getElementById("sistema").style.display = "block";
    carregar();
  }
};

async function login() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ usuario, senha })
    });

    if (!response.ok) {
      return alert("❌ Usuário ou senha inválidos");
    }

    localStorage.setItem("logado", "true");

    document.getElementById("loginTela").style.display = "none";
    document.getElementById("sistema").style.display = "block";

    carregar();

  } catch {
    alert("⚠️ Servidor não conectado");
  }
}

function logout() {
  localStorage.removeItem("logado");
  location.reload();
}

function mostrarPagina(pagina) {
  document.querySelectorAll(".pagina").forEach(p => p.style.display = "none");
  document.getElementById(pagina).style.display = "block";
}

function salvar() {
  localStorage.setItem("precos", JSON.stringify(precos));
}

function adicionarProduto() {
  const produto = document.getElementById("produto").value;

  if (!produto) {
    alert("⚠ Informe o produto");
    return;
  }

  alert("✅ Produto registrado");
}

function adicionarPreco() {
  const fornecedor = document.getElementById("fornecedor").value;
  const preco = parseFloat(document.getElementById("preco").value);

  if (!fornecedor || isNaN(preco)) {
    alert("⚠ Preencha corretamente");
    return;
  }

  precos.push({ fornecedor, preco });
  salvar();

  document.getElementById("fornecedor").value = "";
  document.getElementById("preco").value = "";

  alert("✅ Cotação adicionada");
  carregar();
}

function remover(index) {
  precos.splice(index, 1);
  salvar();
  carregar();
}

function carregar() {
  atualizarLista();
  atualizarDashboard();
}

function atualizarLista(melhor = null) {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  precos.forEach((item, index) => {
    const tr = document.createElement("tr");

    if (melhor && item.fornecedor === melhor.fornecedor) {
      tr.classList.add("highlight");
    }

    tr.innerHTML = `
      <td>${item.fornecedor}</td>
      <td>R$ ${item.preco.toFixed(2)}</td>
      <td>
        <button class="delete-btn" onclick="remover(${index})">
          Excluir
        </button>
      </td>
    `;

    lista.appendChild(tr);
  });
}

function atualizarDashboard() {
  const total = document.getElementById("total");
  const melhorPreco = document.getElementById("melhorPreco");
  const mediaPreco = document.getElementById("mediaPreco");

  total.innerText = precos.length;

  if (precos.length > 0) {
    let melhor = precos.reduce((prev, curr) =>
      curr.preco < prev.preco ? curr : prev
    );

    let media = precos.reduce((acc, p) => acc + p.preco, 0) / precos.length;

    melhorPreco.innerText = "R$ " + melhor.preco.toFixed(2);
    mediaPreco.innerText = "R$ " + media.toFixed(2);

  } else {
    melhorPreco.innerText = "R$ 0";
    mediaPreco.innerText = "R$ 0";
  }
}

function calcularMelhor() {
  if (precos.length === 0) {
    alert("Nenhuma cotação cadastrada");
    return;
  }

  let melhor = precos.reduce((prev, curr) =>
    curr.preco < prev.preco ? curr : prev
  );

  atualizarLista(melhor);

  document.getElementById("resultado").innerText =
    `Melhor fornecedor: ${melhor.fornecedor} - R$ ${melhor.preco.toFixed(2)}`;
}