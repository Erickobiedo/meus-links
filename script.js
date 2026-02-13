// script.js - Funções de autenticação

// Sistema de usuários (simulado - em produção use backend)
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

// Login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const login = document.getElementById('login').value;
            const password = document.getElementById('password').value;
            
            // Busca usuário
            const usuario = usuarios.find(u => u.login === login && u.senha === password);
            
            if (usuario) {
                // Salva sessão
                sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
                window.location.href = 'dashboard.html';
            } else {
                alert('Login ou senha incorretos!');
            }
        });
    }

    // Cadastro
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const login = document.getElementById('login').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validações
            if (password !== confirmPassword) {
                alert('As senhas não conferem!');
                return;
            }
            
            if (usuarios.some(u => u.login === login)) {
                alert('Login já existe!');
                return;
            }
            
            if (usuarios.some(u => u.email === email)) {
                alert('E-mail já cadastrado!');
                return;
            }
            
            // Cria novo usuário
            const novoUsuario = {
                id: Date.now(),
                nome,
                login,
                email,
                senha: password,
                links: []
            };
            
            usuarios.push(novoUsuario);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'index.html';
        });
    }
});