document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const taskList = document.getElementById('task-list');

    // Função para buscar tarefa por código
    function fetchTaskByCodigo(id) {
        fetch(`http://localhost:8080/tarefas/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Tarefa não encontrada');
                }
                return response.json();
            })
            .then(task => {
                // Limpa a lista de tarefas e exibe apenas a tarefa encontrada
                taskList.innerHTML = '';
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${task.id}</td>
                    <td>${task.codigo}</td>
                    <td>${task.titulo}</td>
                    <td>${task.descricao}</td>
                    <td>${task.status}</td>
                    <td>${new Date(task.dataCriacao).toLocaleString()}</td>
                    <td>${task.dataAlteracao ? new Date(task.dataAlteracao).toLocaleString() : 'N/A'}</td>
                    <td>${task.dataConclusao ? new Date(task.dataConclusao).toLocaleString() : 'N/A'}</td>
                    <td>${task.prioridade}</td>
                    <td>${task.responsavel || 'N/A'}</td>
                    <td>
                        ${task.status === "CONCLUIDO" ?
                    '<span style="color: gray;">Concluída</span>' :
                    `<a class="edit-btn" href="edit.html?id=${task.id}">Editar</a>
                          <button class="conclude-btn" data-codigo="${task.codigo}">Concluir</button>`}
                          <button class="delete-btn" data-codigo="${task.codigo}">Deletar</button>
                    </td>
                `;
                taskList.appendChild(row);
            })
            .catch(error => {
                console.error('Error fetching task:', error);
                alert('Tarefa não encontrada');
            });
    }

    // Handle search by id submission
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const codigo = document.getElementById('task-id').value.trim();
        if (codigo) {
            fetchTaskByCodigo(codigo);
        } else {
            alert('Por favor, insira um código válido');
        }
    });
});
