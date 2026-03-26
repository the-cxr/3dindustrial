// --- 1. CONTROLE DE MODAIS E ABAS ---
const authModal = document.getElementById('authModal');
const formLogin = document.getElementById('formLogin');
const formCadastro = document.getElementById('formCadastro');

function openModal() { if(authModal) authModal.style.display = 'block'; }
function fecharTodosModais() { 
    if(authModal) authModal.style.display = 'none';
    const m3 = document.getElementById('verifyModal');
    if(m3) m3.style.display = 'none';
}

function alternarAuth(tipo) {
    if (tipo === 'login') {
        if(formLogin) formLogin.style.display = 'block';
        if(formCadastro) formCadastro.style.display = 'none';
    } else {
        if(formLogin) formLogin.style.display = 'none';
        if(formCadastro) formCadastro.style.display = 'block';
    }
}

window.onclick = (event) => { if (event.target == authModal) fecharTodosModais(); }

// --- 2. LOGIN E CADASTRO (CONEXÃO PYTHON) ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Lógica de Login
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dados = {
                email: document.getElementById('loginEmail').value,
                senha: document.getElementById('loginSenha').value
            };

            try {
                const response = await fetch('http://127.0.0.1:5000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });
                const result = await response.json();

                if (response.ok) {
                    localStorage.setItem('usuarioNome', result.user); 
                    alert(`Bem-vindo, ${result.user}!`);
                    verificarEstadoLogin();
                    window.location.href = "index.html"; 
                } else {
                    alert(result.message);
                }
            } catch (err) { alert("Erro ao conectar com o servidor Python."); }
        });
    }

    // Lógica de Cadastro
    if (formCadastro) {
        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('regNome').value;
            const email = document.getElementById('regEmail').value;
            const senha = document.getElementById('regSenha').value;
            const confirma = document.getElementById('regSenhaConf').value;

            if (senha !== confirma) return alert("As senhas não coincidem!");

            try {
                const response = await fetch('http://127.0.0.1:5000/registrar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senha })
                });
                if (response.ok) {
                    alert("Conta criada! Faça login.");
                    alternarAuth('login');
                } else {
                    const r = await response.json();
                    alert(r.message);
                }
            } catch (err) { alert("Erro ao conectar com o servidor."); }
        });
    }
});

function verificarEstadoLogin() {
    const nomeSalvo = localStorage.getItem('usuarioNome');
    const guestUser = document.getElementById('guestUser');
    const loggedUser = document.getElementById('loggedUser');

    // Se houver alguém logado (ex: Cauã)
    if (nomeSalvo && nomeSalvo !== "undefined") {
        if (guestUser) {
            guestUser.style.display = 'none'; // Some o Entrar
            guestUser.setAttribute('style', 'display: none !important'); // Força o sumiço
        }
        if (loggedUser) {
            loggedUser.style.display = 'flex'; // Mostra o perfil do Cauã
            loggedUser.setAttribute('style', 'display: flex !important');
            
            document.getElementById('userNameNav').innerText = nomeSalvo.split(' ')[0];
            document.getElementById('fullUserName').innerText = nomeSalvo;
        }
    } else {
        // Se ninguém estiver logado
        if (guestUser) {
            guestUser.style.display = 'flex';
            guestUser.setAttribute('style', 'display: flex !important');
        }
        if (loggedUser) {
            loggedUser.style.display = 'none';
            loggedUser.setAttribute('style', 'display: none !important');
        }
    }
}

// Executa assim que a página carrega
document.addEventListener('DOMContentLoaded', verificarEstadoLogin);

function logout() {
    localStorage.removeItem('usuarioNome');
    window.location.href = "index.html";
}

// --- 4. UTILITÁRIOS (WHATSAPP E FAQ) ---
function toggleWhatsApp() {
    const chat = document.getElementById('whatsapp-chat-box');
    if(chat) chat.classList.toggle('chat-box-hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    verificarEstadoLogin();

    // FAQ
    document.querySelectorAll('.faq-pergunta').forEach(p => {
        p.addEventListener('click', () => {
            p.parentElement.classList.toggle('active');
        });
    });
});

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
}

// Fecha o menu se clicar fora dele
window.addEventListener('click', function(e) {
    const loggedUser = document.getElementById('loggedUser');
    const dropdown = document.getElementById('userDropdown');
    if (loggedUser && !loggedUser.contains(e.target)) {
        if(dropdown) dropdown.style.display = 'none';
    }
});

// Atualize sua função verificarEstadoLogin para preencher o nome completo no menu
function verificarEstadoLogin() {
    const nomeSalvo = localStorage.getItem('usuarioNome');
    const guestUser = document.getElementById('guestUser');
    const loggedUser = document.getElementById('loggedUser');
    const userNameNav = document.getElementById('userNameNav');
    const fullUserName = document.getElementById('fullUserName');

    if (nomeSalvo && nomeSalvo !== "undefined") {
        if (guestUser) guestUser.style.display = 'none';
        if (loggedUser) loggedUser.style.display = 'inline-block';
        if (userNameNav) userNameNav.innerText = nomeSalvo.split(' ')[0];
        if (fullUserName) fullUserName.innerText = nomeSalvo; // Nome completo no mini menu
    } else {
        if (guestUser) guestUser.style.display = 'inline-block';
        if (loggedUser) loggedUser.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const nomeSalvo = localStorage.getItem('usuarioNome');
    const inputNome = document.getElementById('perfilNome');
    
    // Se estiver na página de configuração, preenche o nome automaticamente
    if (inputNome && nomeSalvo) {
        inputNome.value = nomeSalvo;
    }

    // Lógica para salvar as edições (Apenas visual por enquanto)
    const formDados = document.getElementById('formMeusDados');
    if (formDados) {
        formDados.addEventListener('submit', (e) => {
            e.preventDefault();
            const novoNome = document.getElementById('perfilNome').value;
            
            // Atualiza o nome localmente para o Header mudar também
            localStorage.setItem('usuarioNome', novoNome);
            
            alert("Dados atualizados com sucesso!");
            window.location.href = "index.html";
        });
    }
});

// Estados

console.log("Script carregado!");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM pronto!");
    
    // TESTE 1: Mudar a cor do fundo para garantir que o JS está rodando
    document.body.style.backgroundColor = "#e0f7fa"; 

    const lista = document.getElementById('lista-prefeituras');
    
    if (!lista) {
        return;
    }

    const cards = lista.querySelectorAll('.flag-card');
    console.log("Quantidade de cards achados:", cards.length);

    let indice = 0;

    function mover() {
        indice++;
        if (indice > cards.length - 3) {
            indice = 0;
        }
        
        const largura = cards[0].offsetWidth + 40; 
        console.log("Movendo para:", -indice * largura);
        
        lista.style.transform = `translateX(-${indice * largura}px)`;
    }

    setInterval(mover, 2000); // Mais rápido (2s) para vermos logo o resultado
});

let dadosTemp = null;

function fecharTodosModais() {
    const m1 = document.getElementById('authModal');
    const m2 = document.getElementById('registerModal');
    const m3 = document.getElementById('verifyModal');

    if(m1) m1.style.display = 'none';
    if(m2) m2.style.display = 'none';
    if(m3) m3.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.slider-track');
    const items = document.querySelectorAll('.slider-item');

    if (!track || items.length === 0) return;

    let contador = 0;
    const gap = 60; // Deve ser o mesmo do CSS

    function mover() {
        // Pega a largura real de um item na tela agora
        const larguraItem = items[0].getBoundingClientRect().width + gap;
        
        contador++;

        // Se chegar perto do fim das imagens (deixa 4 na tela), volta pro começo
        if (contador > items.length - 4) {
            contador = 0;
        }

        track.style.transform = `translateX(-${contador * larguraItem}px)`;
    }

    // Gira a cada 3 segundos
    setInterval(mover, 3000);
});

document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURAÇÃO DO WHATSAPP ---
    const WHATSAPP_NUMERO = "5549998011401";

    // Monitora cliques em qualquer lugar da página (Delegation)
    document.addEventListener('click', (e) => {
        // Verifica se clicou no botão de orçamento
        const btnOrcamento = e.target.closest('.btn-orcamento') || e.target.closest('.slider-item'); 
        
        if (btnOrcamento) {
            // Tenta pegar o nome da imagem ou o texto do botão
            const img = btnOrcamento.querySelector('img');
            const produtoNome = img ? img.alt : "um equipamento";
            
            const mensagem = encodeURIComponent(`Olá, tudo bem? Quero fazer um orçamento do ${produtoNome}`);
            window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${mensagem}`, '_blank');
        }
    });

    // --- CARROSSEL DE EMPRESAS (SLIDER-TRACK) ---
    const track = document.querySelector('.slider-track');
    const items = document.querySelectorAll('.slider-item');

    if (track && items.length > 0) {
        // Clonagem para evitar que as imagens sumam no final
        items.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });

        let index = 0;
        const gap = 40; // Espaço entre logos

        function moverEmpresas() {
            // Força o cálculo da largura a cada movimento para evitar 'invisibilidade'
            const larguraItem = items[0].getBoundingClientRect().width + gap;
            index++;

            track.style.transition = "transform 0.8s ease-in-out";
            track.style.transform = `translateX(-${index * larguraItem}px)`;

            // Se chegar ao fim das originais, reseta sem o usuário ver
            if (index >= items.length) {
                setTimeout(() => {
                    track.style.transition = "none";
                    index = 0;
                    track.style.transform = `translateX(0)`;
                }, 800);
            }
        }

        setInterval(moverEmpresas, 3000);
    }
});

// Espera o documento carregar para garantir que os botões existam
document.addEventListener('DOMContentLoaded', () => {
    const perguntas = document.querySelectorAll('.faq-pergunta');

    perguntas.forEach(pergunta => {
        pergunta.addEventListener('click', () => {
            const itemPai = pergunta.parentElement;

            // Opcional: Fecha outras perguntas ao abrir uma nova
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== itemPai) item.classList.remove('active');
            });

            // Abre ou fecha a atual
            itemPai.classList.toggle('active');
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    
    // Função para verificar se estamos na aba SICS
    function verificarPaginaSics() {
        // Se a sua aba SICS for uma seção na mesma página:
        const secaoSics = document.getElementById('secao-sics');
        
        if (secaoSics) {
            // Lógica baseada em scroll: Header aparece quando chega na SICS
            window.addEventListener('scroll', () => {
                const posicaoSics = secaoSics.getBoundingClientRect().top;
                if (posicaoSics <= 100) {
                    header.style.display = 'flex';
                } else {
                    header.style.display = 'none';
                }
            });
        } else if (window.location.href.includes('sics.html')) {
            // Se for uma página separada (.html), o header fica sempre visível nela
            header.style.display = 'flex';
        }
    }

    verificarPaginaSics();
});

document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.slider-track-banner');
    const banners = document.querySelectorAll('.banner-item');
    
    // Se não tiver pelo menos 2 banners, não precisa de carrossel
    if (!track || banners.length < 2) return;

    let index = 0;

    function girarBanner() {
        index++;
        
        // Se chegar no final dos banners disponíveis, volta pro zero
        if (index >= banners.length) {
            index = 0;
        }

        // Move exatamente 100% da largura de um banner para a esquerda
        const deslocamento = index * 100;
        track.style.transform = `translateX(-${deslocamento}%)`;
    }

    // Troca a cada 5 segundos
    setInterval(girarBanner, 5000);
});

function finalizarCompra() {
    const entrega = document.querySelector('input[name="entrega"]:checked').value;
    const pagamento = document.getElementById('metodo-pagamento').value;

    // Lógica para enviar o resumo ou salvar no banco
    alert("Processando seu pedido...");
    
    // Redireciona para a página de sucesso
    window.location.href = "obrigado.html";
}

function irParaPagamento() {
    // 1. Pegamos a quantidade que o cliente escolheu
    const qtd = document.getElementById('qtd-produto').value;
    
    // 2. O seu link oficial do Mercado Pago (Cole entre as aspas abaixo)
    const linkMercadoPago = "https://mpago.la/28G1yMK";

    // 3. Redirecionamos o cliente para o ambiente seguro do Mercado Pago
    // Usamos o link para realizar a venda
    window.location.href = linkMercadoPago;
}

if (response.ok) {
    // 1. Salva os dados primeiro
    localStorage.setItem('usuarioNome', result.user); 
    
    alert(`Bem-vindo, ${result.user}!`);
    

    // 3. Redireciona
    window.location.href = "index.html"; 
}

        // Verifica se o usuário já está logado ao carregar a página
if (response.ok) {
    // 1. Salva os dados primeiro
    localStorage.setItem('usuarioNome', result.user); 
    
    alert(`Bem-vindo, ${result.user}!`);
    
    // 3. Redireciona
    window.location.href = "index.html"; 
}

// Abre/Fecha o menu suspenso
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Função de Sair
function logout() {
    localStorage.removeItem('usuarioNome');
    window.location.href = "index.html"; // Recarrega para limpar o estado
}

// Fecha o dropdown se clicar fora dele
window.addEventListener('click', function(e) {
    const userArea = document.getElementById('userArea');
    const dropdown = document.getElementById('userDropdown');
    if (userArea && !userArea.contains(e.target)) {
        if(dropdown) dropdown.style.display = 'none';
    }
});

// Chamar a verificação assim que o DOM carregar
document.addEventListener('DOMContentLoaded', verificarEstadoLogin);

function verificarEstadoLogin() {
    // 1. Tenta pegar o nome que salvamos no login
    const nomeSalvo = localStorage.getItem('usuarioNome');
    
    // 2. Localiza os elementos no topo do site (Header)
    const guestUser = document.getElementById('guestUser'); // Link "Entrar"
    const loggedUser = document.getElementById('loggedUser'); // Div do Perfil
    const userNameNav = document.getElementById('userNameNav'); // Onde vai o nome

    // 3. Se houver um nome salvo, esconde "Entrar" e mostra o Perfil
    if (nomeSalvo && nomeSalvo !== "undefined") {
        if (guestUser) guestUser.style.display = 'none';
        if (loggedUser) loggedUser.style.display = 'inline-block';
        if (userNameNav) {
            // Mostra apenas o primeiro nome para não quebrar o layout
            userNameNav.innerText = nomeSalvo.split(' ')[0]; 
        }
    } else {
        // Se não tiver ninguém logado, garante que o botão "Entrar" apareça
        if (guestUser) guestUser.style.display = 'inline-block';
        if (loggedUser) loggedUser.style.display = 'none';
    }
}

// EXECUÇÃO IMEDIATA: Garante que o site verifique o login assim que carrega
document.addEventListener('DOMContentLoaded', verificarEstadoLogin);
window.addEventListener('load', verificarEstadoLogin); // Reforço extra

// Função isolada para o carrossel das prefeituras
function moverPrefeituras() {
    const lista = document.getElementById('lista-prefeituras');
    if (!lista) return;

    let deslocamento = 0;
    const larguraCard = 280; // Largura do card + margem (ajuste conforme seu CSS)

    setInterval(() => {
        deslocamento += larguraCard;
        
        // Se deslocar demais (chegar no fim), volta ao início
        // Multiplique larguraCard pelo número de prefeituras que você tem
        if (deslocamento >= larguraCard * 5) { 
            deslocamento = 0;
        }

        lista.style.transform = `translateX(-${deslocamento}px)`;
        lista.style.transition = "transform 1s ease-in-out";
    }, 3000);
}

// Garante que o carrossel inicie mesmo que haja erros em outros scripts
window.onload = () => {
    moverPrefeituras();
};

// 1. MÁSCARA AUTOMÁTICA CPF/CNPJ
function formatarDocumento(campo) {
    let v = campo.value.replace(/\D/g, ""); 
    if (v.length <= 11) {
        v = v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
        v = v.replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2");
    }
    campo.value = v;
}

// 2. CONTROLE DE ESTADO (MATA O 'ENTRAR')
function verificarEstadoLogin() {
    const nome = localStorage.getItem('usuarioNome');
    const guest = document.getElementById('guestUser');
    const logged = document.getElementById('loggedUser');

    if (nome && nome !== "undefined") {
        if (guest) guest.classList.add('auth-deletar-elemento');
        if (logged) logged.style.setProperty('display', 'flex', 'important');
        document.getElementById('userNameNav').innerText = nome.split(' ')[0];
    } else {
        if (guest) guest.classList.remove('auth-deletar-elemento');
        if (logged) logged.style.setProperty('display', 'none', 'important');
    }
}

// 3. FLUXO: CADASTRO -> VERIFICAÇÃO
async function handleCadastro(e) {
    e.preventDefault();
    // Simula envio de e-mail
    document.getElementById('fluxoInicial').style.display = 'none';
    document.getElementById('fluxoVerificacao').style.display = 'block';
    alert("Código de 6 dígitos enviado para seu e-mail!");
}

document.addEventListener('DOMContentLoaded', verificarEstadoLogin);

// --- FLUXO DE CADASTRO -> VERIFICAÇÃO ---
async function finalizarCadastro(e) {
    e.preventDefault();
    // Simula envio de e-mail e muda a aba
    document.getElementById('tabAuthContainer').style.display = 'none';
    document.getElementById('secaoVerificacao').style.display = 'block';
    alert("Código de 6 dígitos enviado para seu e-mail!");
}