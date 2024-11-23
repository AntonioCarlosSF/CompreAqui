document.getElementById('loginForm').addEventListener('submit', function(event) {
    // Prevent default form submission (optional for validation or further logic)
    event.preventDefault();
    
    // Redirecionamento (se necessário, você pode validar as credenciais aqui antes)
    window.location.href = 'home.html';
});
