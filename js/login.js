document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Captura os dados do formulário
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    try {
        // Faz a requisição POST para o backend
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if (response.ok) {
            // Login bem-sucedido
            alert('Login bem-sucedido!');
            window.location.href = 'home.html'; // Redireciona para a página inicial ou desejada
        } else {
            // Exibe mensagem de erro retornada pelo servidor
            
            const errorMessage = data.message || 'Erro ao fazer login. Por favor, tente novamente.';
            document.getElementById('message').innerText = errorMessage;
        }
    } catch (error) {
        // Trata erros de conexão ou problemas inesperados
        alert('Erro ao fazer login');
    }
});
