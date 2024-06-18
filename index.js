const checkTodos = document.getElementById("checkTodos");
const checkNome = document.getElementById("checkNome");
const checkAtividades = document.getElementById("checkAtividades");
const checkEndereco = document.getElementById("checkEndereco");
const checkSocios = document.getElementById("checkSocios");
const checkEmail = document.getElementById("checkEmail");
const inps_check = document.querySelectorAll(".inp-check");
//Filtros
const btnFiltro = document.querySelector(".filtro");
const contFiltro = document.querySelector(".filtros-ex");
const tela = document.querySelector(".tela");

btnFiltro.addEventListener("click", (evt) => {
  contFiltro.classList.add("filtros-ex-active");
  tela.style.display = "block";
});

//Dados 2
const menus2 = document.querySelectorAll(".menu2");
const dados2 = document.querySelector(".dados-ex");

menus2.forEach((menu) => {
  menu.addEventListener("click", (evt) => {
    dados2.classList.add("dados-ex-active");
    tela.style.display = "block";
  });
});

tela.addEventListener("click", (evt) => {
  contFiltro.classList.remove("filtros-ex-active");
  dados2.classList.remove("dados-ex-active");
  tela.style.display = "none";
});

//Cargos
const btnsCargo = document.querySelectorAll(".btn-cargo");
const menus = document.querySelectorAll(".menu");
const nome = document.querySelector(".nome");
const atv_p = document.querySelector(".atv-p");
const atv_s = document.querySelector(".atv-s");
const endereco = document.querySelector(".endereco");
const socios = document.querySelector(".socios");
const email = document.querySelector(".email");

btnsCargo.forEach((btn) => {
  btn.addEventListener("click", (evt) => {
    localStorage.setItem("cargo", evt.target.id);
    selecao(evt.target.id);
    updateBtnCargo();
    updateBorder();
  });
});

const selecao = (id) => {
  btnsCargo.forEach((btn) => {
    btn.classList.remove("btn-cargo-active");
  });

  switch (id) {
    case "vendas":
      updateBoxVendas();
      break;

    case "caixa":
      updateBoxCaixa();
      break;
    case "website":
      updateBoxWebsite();
      break;

    default:
      break;
  }
};

//Consulta
const inp_cnpj = document.querySelector("#inp_cnpj");
const btn_busca = document.querySelector("#btn_busca");
const resCnpj = document.querySelector("#cnpj");
const resNome = document.querySelector("#nome");
const resAtvP = document.querySelector("#atvP");
const resAtvS = document.querySelector("#atvS");
const resEndereco = document.querySelector("#endereco");
const resSocios = document.querySelector("#socios");
const resSituacao = document.querySelector("#situacao");
const resInscricao = document.querySelector("#inscricao");
const resTelefone = document.querySelector("#telefone");
const resEmail = document.querySelector("#email");

//res

btn_busca.addEventListener("click", () => {
  consulta();
});

const consulta = () => {
  const cnpj = inp_cnpj.value.replace(/\D/g, "");
  const endpoint = `https://publica.cnpj.ws/cnpj/${cnpj}`;
  console.clear();
  fetch(endpoint)
    .then((res) => res.json())
    .then((res) => {
      if (res.status == 429) {
        alert("Muitas Requisições");
        return;
      }
      if (res.status == 400) {
        alert("CNPJ Inválido");
        return;
      }
      console.log(res);
      inp_cnpj.value = "";
      resCnpj.innerHTML = `Cnpj: ${res.estabelecimento.cnpj}`;
      resNome.innerHTML = `${res.razao_social}<br>`;
      if (res.estabelecimento.nome_fantasia) {
        resNome.innerHTML += res.estabelecimento.nome_fantasia;
      }
      resAtvP.innerHTML = res.estabelecimento.atividade_principal.descricao;
      resEmail.innerHTML = res.estabelecimento.email;
      if (res.estabelecimento.atividades_secundarias.length >= 3) {
        resAtvS.innerHTML = `${res.estabelecimento.atividades_secundarias[0].descricao}<br>`;
        resAtvS.innerHTML += `${res.estabelecimento.atividades_secundarias[1].descricao}<br>`;
        resAtvS.innerHTML += `${res.estabelecimento.atividades_secundarias[2].descricao}`;
      } else if (res.estabelecimento.atividades_secundarias.length > 0) {
        resAtvS.innerHTML = `${res.estabelecimento.atividades_secundarias[0].descricao}`;
      } else {
        resAtvS.innerHTML = "";
      }
      var complemento = res.estabelecimento.complemento;
      if (!complemento) {
        complemento = "Não possui um complemento";
      }
      resEndereco.innerHTML = `${res.estabelecimento.tipo_logradouro}: ${res.estabelecimento.logradouro} - ${res.estabelecimento.numero}<br>
     ${res.estabelecimento.bairro} - ${res.estabelecimento.cidade.nome} - ${res.estabelecimento.estado.sigla} <br>
      CEP: ${res.estabelecimento.cep}<br>
      Complemento: ${complemento}
      `;
      if (res.socios.length > 0) {
        res.socios.forEach((el) => {
          resSocios.innerHTML += `${el.nome}<br>`;
        });
      } else {
        resSocios.innerHTML = "";
      }
      resSituacao.innerHTML = res.estabelecimento.situacao_cadastral;
      if (res.estabelecimento.situacao_cadastral !== "Ativa") {
        document.querySelector(".dados2").style.background = "#e56464";
      } else {
        document.querySelector(".dados2").style.background = "#001843";
      }
      resTelefone.innerHTML = `(${res.estabelecimento.ddd1}) ${res.estabelecimento.telefone1}`;

      if (res.estabelecimento.inscricoes_estaduais.length > 0) {
        res.estabelecimento.inscricoes_estaduais.forEach((el) => {
          if (el.ativo === true) {
            resInscricao.innerHTML = `${el.inscricao_estadual}`;
            return;
          } else {
            resInscricao.innerHTML = "Não possue inscrição ativa";
          }
        });
      } else {
        resInscricao.innerHTML = "Não possue inscrição Estadual";
      }
    })
    .catch((err) => {});
};

const contInscricao = document.querySelector(".inscricao");
const contTelefone = document.querySelector(".telefone");

contInscricao.addEventListener("click", async (evt) => {
  var selecao = document.createRange();
  selecao.selectNodeContents(resInscricao);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(selecao);

  if (window.getSelection().toString() !== "") {
    try {
      await navigator.clipboard.writeText(window.getSelection().toString());

      const copyMessage = document.getElementById("copy");
      if (!copyMessage) {
        document.getElementById("a").innerHTML += `<p id="copy">Copiado</p>`;
        setTimeout(function () {
          const msg = document.getElementById("copy");
          if (msg) {
            msg.remove();
          }
        }, 1000);
      }
    } catch (err) {
      console.error("Erro ao copiar texto: ", err);
      alert("Erro ao copiar texto. Por favor, tente novamente.");
    }
  }
  window.getSelection().removeAllRanges();
});

contTelefone.addEventListener("click", async (evt) => {
  var selecao = document.createRange();
  selecao.selectNodeContents(resTelefone);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(selecao);

  if (window.getSelection().toString() !== "") {
    try {
      await navigator.clipboard.writeText(window.getSelection().toString());

      const copyMessage = document.getElementById("copy");
      if (!copyMessage) {
        document.getElementById("b").innerHTML += `<p id="copy">Copiado</p>`;
        setTimeout(function () {
          const msg = document.getElementById("copy");
          if (msg) {
            msg.remove();
          }
        }, 1000);
      }
    } catch (err) {
      console.error("Erro ao copiar texto: ", err);
      alert("Erro ao copiar texto. Por favor, tente novamente.");
    }
  }
  window.getSelection().removeAllRanges();
});

inp_cnpj.addEventListener("keypress", (evt) => {
  if (evt.keyCode == 13) {
    consulta();
  }
});

inps_check.forEach((inp) => {
  inp.addEventListener("change", (evt) => {
    if (evt.target.id == "checkTodos" && evt.target.checked) {
      inps_check.forEach((el) => {
        el.checked = true;
        localStorage.setItem(el.id, true);
      });
    } else if (evt.target.id == "checkTodos" && !evt.target.checked) {
      inps_check.forEach((el) => {
        el.checked = false;
        localStorage.setItem(el.id, false);
      });
    }
    if (evt.target.checked) {
      localStorage.setItem(evt.target.id, true);
    } else {
      localStorage.setItem(evt.target.id, false);
    }
    updateCheck();
    updateDados();
    updateBorder();
  });
});

const updateCheck = () => {
  inps_check.forEach((el) => {
    const a = localStorage.getItem(el.id);
    if (a == "true") {
      el.checked = true;
    } else {
      el.checked = false;
    }
  });
};
updateCheck();

const updateDados = () => {
  inps_check.forEach((el) => {
    const a = localStorage.getItem(el.id);
    switch (el.id) {
      case "checkNome":
        if (a == "true") {
          nome.style.display = "block";
        } else {
          nome.style.display = "none";
        }
        break;
      case "checkAtividades":
        if (a == "true") {
          atv_p.style.display = "block";
          atv_s.style.display = "block";
        } else {
          atv_p.style.display = "none";
          atv_s.style.display = "none";
        }
        break;
      case "checkEnderecos":
        if (a == "true") {
          endereco.style.display = "block";
        } else {
          endereco.style.display = "none";
        }
        break;
      case "checkSocios":
        if (a == "true") {
          socios.style.display = "block";
        } else {
          socios.style.display = "none";
        }
        break;
      case "checkEmail":
        if (a == "true") {
          email.style.display = "block";
        } else {
          email.style.display = "none";
        }
        break;

      default:
        break;
    }
  });
};
updateDados();

const updateBoxVendas = () => {
  inps_check.forEach((el) => {
    el.checked = true;
    localStorage.setItem(el.id, true);
    updateDados();
  });
};
const updateBoxCaixa = () => {
  inps_check.forEach((el) => {
    el.checked = false;
    localStorage.setItem(el.id, false);
  });
  checkNome.checked = true;
  localStorage.setItem("checkNome", true);
  updateDados();
};
const updateBoxWebsite = () => {
  inps_check.forEach((el) => {
    el.checked = false;
    localStorage.setItem(el.id, false);
  });
  checkNome.checked = true;
  localStorage.setItem("checkNome", true);
  checkAtividades.checked = true;
  localStorage.setItem("checkAtividades", true);
  updateDados();
};
const updateBtnCargo = () => {
  const a = localStorage.getItem("cargo");
  const aa = document.getElementById(a);
  aa.classList.add("btn-cargo-active");
};
updateBtnCargo();

const updateBorder = () => {
  const menusArray = [...menus];
  let a = false;
  let z = false;
  let contagem = 0;
  menusArray.forEach((el) => {
    el.classList.remove("borderL");
    el.classList.remove("borderF");
    el.classList.remove("borderU");
  });
  //Boreder Last
  for (let i = 0; i < menusArray.length; i++) {
    const el = menusArray[i];
    if (el.style.display !== "none" && !a) {
      el.classList.add("borderF");
      a = !a;
    }
  }
  for (let i = menusArray.length - 1; i >= 0; i--) {
    const el = menusArray[i];
    console.log("a");
    if (el.style.display !== "none" && !z) {
      el.classList.add("borderL");
      z = !z;
    }
  }
  menusArray.forEach((el) => {
    if (el.style.display === "none") {
      contagem++;
    }
    if (contagem == 5) {
      menusArray.forEach((menu) => {
        if (menu.style.display !== "none") {
          menu.classList.add("borderU");
        }
      });
    }
  });
};
updateBorder();
