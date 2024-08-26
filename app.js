document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    
    function fetchTasks() {
        fetch('http://localhost:8080/tarefas')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${task.id}</td>
                        <td>${task.titulo}</td>
                        <td>${task.descricao}</td>
                        <td>${task.status}</td>
                        <td>${new Date(task.dataCriacao).toLocaleString()}</td>
                        <td>${task.dataAlteracao ? new Date(task.dataAlteracao).toLocaleString() : 'N/A'}</td>
                        <td>${task.dataConclusao ? new Date(task.dataConclusao).toLocaleString() : 'N/A'}</td>
                        <td>${task.prioridade}</td>
                        <td>${task.responsavel || 'N/A'}</td>
                        <td>
                            <a href="edit.html?id=${task.id}">Editar</a>
                            <button class="delete-btn" data-id="${task.id}">Deletar</button>
                        </td>
                    `;
                    taskList.appendChild(row);
                });

                
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
                    fetchTasks(); 
                } else {
                    throw new Error('Failed to delete task');
                }
            })
            .catch(error => console.error('Error deleting task:', error));
    }

    
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const titulo = document.getElementById('titulo').value.trim();
        const descricao = document.getElementById('descricao').value.trim();
        const status = document.getElementById('status').value.trim();
        const prioridade = document.getElementById('prioridade').value.trim();
        const responsavel = document.getElementById('responsavel').value.trim();

       
        if (!titulo || !descricao || !status || !prioridade || !responsavel) {
            alert('Por favor, preencha todos os campos.');
            return;
        }


        const now = new Date();
        const dataCriacao = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        fetch('http://localhost:8080/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo,
                descricao,
                status,
                prioridade,
                responsavel,
                dataCriacao 
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
