document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Captura os dados do formulário
    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;

    try {
        // Faz a requisição POST para o backend
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Login bem-sucedido
            alert('Login bem-sucedido!');
            // Você pode redirecionar o usuário para outra página, por exemplo:
            window.location.href = 'dashboard.html'; // Ajuste para a página desejada
        } else {
            // Exibe mensagem de erro retornada pelo servidor
            document.getElementById('message').innerText = data.message || 'Erro ao fazer login.';
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        document.getElementById('message').innerText = 'Erro ao conectar ao servidor.';
    }
});
