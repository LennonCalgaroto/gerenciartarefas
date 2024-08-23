document.addEventListener('DOMContentLoaded', () => {
    const editForm = document.getElementById('edit-form');
    const deleteBtn = document.getElementById('delete-btn');
    const taskIdInput = document.getElementById('task-id');
    const tituloInput = document.getElementById('titulo');
    const descricaoInput = document.getElementById('descricao');

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
        })
        .catch(error => console.error('Error fetching task:', error));

    // Handle form submission
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = taskIdInput.value;
        const titulo = tituloInput.value;
        const descricao = descricaoInput.value;

        fetch(`http://localhost:8080/tarefas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo, descricao })
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

    // Handle task deletion
    deleteBtn.addEventListener('click', () => {
        const id = taskIdInput.value;

        fetch(`http://localhost:8080/tarefas/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = 'index.html';
                } else {
                    throw new Error('Failed to delete task');
                }
            })
            .catch(error => console.error('Error deleting task:', error));
    });
});
