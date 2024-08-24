document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    // Fetch and display tasks
    function fetchTasks() {
        fetch('http://localhost:8080/tarefas')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${task.id}</td>
                        <td>${task.codigo}</td>
                        <td>${task.titulo}</td>
                        <td>${task.descricao}</td>
                        <td class="status">${task.status === 'EM_PROGRESSO' ? 'EM PROGRESSO' : task.status}</td>
                        <td>${new Date(task.dataCriacao).toLocaleString()}</td>
                        <td>${task.dataAlteracao ? new Date(task.dataAlteracao).toLocaleString() : 'N/A'}</td>
                        <td>${task.dataConclusao ? new Date(task.dataConclusao).toLocaleString() : 'N/A'}</td>
                        <td>${task.prioridade}</td>
                        <td>${task.responsavel || 'N/A'}</td>
                        <td>
                            ${task.status === "CONCLUIDO" ?
                             '<span style="color: gray;">Concluída</span>' :
                             `<a class="edit-btn" href="edit.html?id=${task.id}">Editar</a>
                              <button class="conclude-btn" data-id="${task.id}">Concluir</button>`}
                              <button class="delete-btn" data-id="${task.id}">Deletar</button>
                        </td>
                    `;
            taskList.appendChild(row);
    });

document.querySelectorAll('.conclude-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');

        // Fetch the current task details before updating
        fetch(`http://localhost:8080/tarefas/${id}`)
            .then(response => response.json())
            .then(task => {

                const now = new Date();
                const dataConclusao = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;


                // Send the updated task back to the server
                fetch(`http://localhost:8080/tarefas/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        codigo: task.codigo,
                        titulo: task.titulo,
                        descricao: task.descricao,
                        status: "CONCLUIDO",
                        prioridade: task.prioridade,
                        responsavel: task.responsavel,
                        dataCriacao: task.dataCriacao,
                        dataAlteracao: task.dataAlteracao,
                        dataConclusao: dataConclusao
                    })
                })
                    .then(response => {
                        if (response.ok) {
                            window.location.reload(); // Reload the page to reflect the updated status
                        } else {
                            throw new Error('Failed to conclude task');
                        }
                    })
                    .catch(error => console.error('Error concluding task:', error));
            })
            .catch(error => console.error('Error fetching task details:', error));
    });
});

// Add event listeners for delete buttons
document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        if (confirm('Tem certeza de que deseja deletar esta tarefa?')) {
            deleteTask(id);
        }
    });
});
})
.catch(error => console.error('Error fetching tasks:', error));
    }

    function deleteTask(id) {
        fetch(`http://localhost:8080/tarefas/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    fetchTasks(); // Refresh the task list
                } else {
                    throw new Error('Failed to delete task');
                }
            })
            .catch(error => console.error('Error deleting task:', error));
    }

    // Handle new task submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const codigo = document.getElementById('codigo').value;
        const titulo = document.getElementById('titulo').value.trim();
        const descricao = document.getElementById('descricao').value.trim();
        const status = document.getElementById('status').value.trim();
        const prioridade = document.getElementById('prioridade').value.trim();
        const responsavel = document.getElementById('responsavel').value.trim();

        // Validate form inputs
        if (!codigo || !titulo || !descricao || !status || !prioridade || !responsavel) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Captura a data e hora locais no formato desejado
        const now = new Date();
        const dataCriacao = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        fetch('http://localhost:8080/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codigo,
                titulo,
                descricao,
                status,
                prioridade,
                responsavel,
                dataCriacao // Set current date/time for creation
            })
        })
            .then(response => {
                if (response.ok) {
                    taskForm.reset();
                    fetchTasks();
                } else {
                    return response.json().then(data => {throw new Error(data.message)});
                }
            })
            .catch(error => console.error('Error adding task:', error));
    });

    fetchTasks(); // Initial load of tasks
});
