// admin.js - Funções do painel administrativo

document.addEventListener('DOMContentLoaded', function() {
    // Verifica se usuário está logado
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    
    if (!usuarioLogado) {
        window.location.href = 'index.html';
        return;
    }

    // Exibe nome do usuário
    const userNameSpan = document.getElementById('userName');
    if (userNameSpan) {
        userNameSpan.textContent = usuarioLogado.nome;
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('usuarioLogado');
            window.location.href = 'index.html';
        });
    }

    // Modal
    const modal = document.getElementById('linkModal');
    const addBtn = document.getElementById('addLinkBtn');
    const closeBtn = document.querySelector('.close');

    if (addBtn) {
        addBtn.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Formulário de adicionar link
    const linkForm = document.getElementById('linkForm');
    if (linkForm) {
        linkForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const plataforma = document.getElementById('plataforma').value;
            const nome = document.getElementById('nome').value;
            const imagem = document.getElementById('imagem').value;
            const link = document.getElementById('link').value;
            
            // Ícones padrão para cada plataforma
            const icones = {
                tiktok: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png',
                instagram: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
                whatsapp: 'https://cdn-icons-png.flaticon.com/512/733/733585.png',
                youtube: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
                github: 'https://cdn-icons-png.flaticon.com/512/733/733609.png'
            };
            
            const novoLink = {
                id: Date.now(),
                plataforma,
                nome,
                imagem: imagem || icones[plataforma],
                link,
                data: new Date().toLocaleDateString()
            };
            
            // Adiciona link ao usuário
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const usuarioIndex = usuarios.findIndex(u => u.id === usuarioLogado.id);
            
            if (usuarioIndex !== -1) {
                if (!usuarios[usuarioIndex].links) {
                    usuarios[usuarioIndex].links = [];
                }
                usuarios[usuarioIndex].links.push(novoLink);
                
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarios[usuarioIndex]));
                
                // Limpa formulário e fecha modal
                linkForm.reset();
                modal.style.display = 'none';
                
                // Recarrega links
                carregarLinks();
            }
        });
    }

    // Carrega links do usuário
    function carregarLinks() {
        const linksGrid = document.getElementById('linksGrid');
        if (!linksGrid) return;
        
        const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioAtual = usuarios.find(u => u.id === usuario.id);
        
        if (!usuarioAtual || !usuarioAtual.links || usuarioAtual.links.length === 0) {
            linksGrid.innerHTML = '<p class="no-links">Nenhum link adicionado ainda. Clique em "Adicionar Novo Link" para começar!</p>';
            return;
        }
        
        // Ordena links por data (mais recentes primeiro)
        const linksOrdenados = usuarioAtual.links.sort((a, b) => b.id - a.id);
        
        linksGrid.innerHTML = linksOrdenados.map(link => `
            <div class="link-card" data-id="${link.id}">
                <div class="link-image">
                    <img src="${link.imagem}" alt="${link.nome}" onerror="this.src='https://via.placeholder.com/300x160?text=Erro+ao+carregar'">
                </div>
                <div class="link-info">
                    <span class="link-platform">${getPlataformaNome(link.plataforma)}</span>
                    <h3>${link.nome}</h3>
                    <div class="link-actions">
                        <a href="${link.link}" target="_blank" class="btn-visit">Visitar</a>
                        <button onclick="deletarLink(${link.id})" class="btn-delete">Deletar</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Função global para deletar link
    window.deletarLink = function(linkId) {
        if (confirm('Tem certeza que deseja deletar este link?')) {
            const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const usuarioIndex = usuarios.findIndex(u => u.id === usuario.id);
            
            if (usuarioIndex !== -1) {
                usuarios[usuarioIndex].links = usuarios[usuarioIndex].links.filter(l => l.id !== linkId);
                
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarios[usuarioIndex]));
                
                carregarLinks();
            }
        }
    };

    // Função auxiliar para nome da plataforma
    function getPlataformaNome(plataforma) {
        const nomes = {
            tiktok: '📱 TikTok',
            instagram: '📷 Instagram',
            whatsapp: '💬 WhatsApp',
            youtube: '▶️ YouTube',
            github: '🐙 GitHub'
        };
        return nomes[plataforma] || plataforma;
    }

    // Carrega links ao iniciar
    carregarLinks();
});