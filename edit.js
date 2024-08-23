document.addEventListener('DOMContentLoaded', () => {
    const editForm = document.getElementById('edit-form');
    const taskIdInput = document.getElementById('task-id');
    const tituloInput = document.getElementById('titulo');
    const descricaoInput = document.getElementById('descricao');
    const statusInput = document.getElementById('status');
    const prioridadeInput = document.getElementById('prioridade');
    const responsavelInput = document.getElementById('responsavel');

    // Get task ID from URL
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get('id');

    // Fetch task details
    fetch(`http://localhost:8080/tarefas/${taskId}`)
        .then(response => response.json())
        .then(task => {
            taskIdInput.value = task.id;
            tituloInput.value = task.titulo;
            descricaoInput.value = task.descricao;
            statusInput.value = task.status;
            prioridadeInput.value = task.prioridade;
            responsavelInput.value = task.responsavel;
        })
        .catch(error => console.error('Error fetching task:', error));

    // Handle form submission
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = taskIdInput.value;
        const titulo = tituloInput.value.trim();
        const descricao = descricaoInput.value.trim();
        const status = statusInput.value;
        const prioridade = prioridadeInput.value;
        const responsavel = responsavelInput.value.trim();

        const now = new Date();
        const dataAlteracao = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;


        fetch(`http://localhost:8080/tarefas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo,
                descricao,
                status,
                prioridade,
                responsavel,
                dataAlteracao // Inclui a data de alteração na requisição
            })
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = 'index.html';
                } else {
                    throw new Error('Failed to update task');
                }
            })
            .catch(error => console.error('Error updating task:', error));
    });
});
