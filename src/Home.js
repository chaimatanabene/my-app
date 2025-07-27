import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const [columns, setColumns] = useState({
    "À faire": [],
    "En cours": [],
    "Terminé": [],
    "Annulé": []
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personnel');
  const [priority, setPriority] = useState('Moyenne');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('À faire');
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const statuses = Object.keys(columns);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tasks')
      .then(res => res.json())
      .then(tasks => {
        const grouped = {
          "À faire": [],
          "En cours": [],
          "Terminé": [],
          "Annulé": []
        };
        tasks.forEach(task => {
          grouped[task.status]?.push(task);
        });
        setColumns(grouped);
      });
  }, []);

  const handleAddOrEditTask = async (e) => {
    e.preventDefault();

    const newTask = {
      title,
      description,
      category,
      priority,
      deadline,
      status,
    };

    if (editingTaskId) {
      await fetch(`http://127.0.0.1:8000/api/tasks/${editingTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
    } else {
      const res = await fetch('http://127.0.0.1:8000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      const created = await res.json();
      newTask.id = created.id;
    }

    setEditingTaskId(null);
    setTitle('');
    setDescription('');
    setCategory('Personnel');
    setPriority('Moyenne');
    setDeadline('');
    setStatus('À faire');

    const res = await fetch('http://127.0.0.1:8000/api/tasks');
    const updated = await res.json();
    const grouped = { "À faire": [], "En cours": [], "Terminé": [], "Annulé": [] };
    updated.forEach(t => grouped[t.status]?.push(t));
    setColumns(grouped);
  };

  const handleDeleteTask = async (taskId) => {
    await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
      method: 'DELETE'
    });

    setColumns(prev => {
      const updated = {};
      for (const key of statuses) {
        updated[key] = prev[key].filter(task => task.id !== taskId);
      }
      return updated;
    });
  };

  const handleEditClick = (task, columnId) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setCategory(task.category);
    setPriority(task.priority);
    setDeadline(task.deadline);
    setStatus(columnId);
  };

  const handleDragEnd = (result) => {
  const { source, destination } = result;

  if (
    !destination ||
    (source.droppableId === destination.droppableId &&
      source.index === destination.index)
  ) {
    return;
  }

  setColumns(prev => {
    const updated = { ...prev };
    const srcTasks = Array.from(updated[source.droppableId]);
    const [movedTask] = srcTasks.splice(source.index, 1);

    if (!movedTask) return prev;

    movedTask.status = destination.droppableId;

    const destTasks = Array.from(updated[destination.droppableId] || []);
    destTasks.splice(destination.index, 0, movedTask);

    updated[source.droppableId] = srcTasks;
    updated[destination.droppableId] = destTasks;

    // 🔁 Send update to backend *after* state update
    fetch(`http://127.0.0.1:8000/api/tasks/${movedTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movedTask),
    }).catch(err => {
      console.error("Failed to update task status on backend", err);
    });

    return updated;
  });
};



  const filteredColumns = {};
  for (const key of statuses) {
    filteredColumns[key] = columns[key].filter(task => {
  const statusMatch = filterStatus === '' || task.status === filterStatus;
  const priorityMatch = filterPriority === '' || task.priority === filterPriority;
  const categoryMatch = filterCategory === '' || task.category === filterCategory;

  return statusMatch && priorityMatch && categoryMatch;
});
  }

  const priorityClassMap = {
    'Haute': 'priority-haute',
    'Moyenne': 'priority-moyenne',
    'Basse': 'priority-basse'
  };

  const isOverdue = (deadline) => deadline && moment().isAfter(moment(deadline), 'day');
  const isDeadlineClose = (deadline) => {
    if (!deadline) return false;
    const diff = moment(deadline).diff(moment(), 'days');
    return diff >= 0 && diff <= 2;
  };

  return (
    <div className={`login-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="header">
        <div className="app-title">
          <span className="logo">✅</span>
          <h1>TaskFlow</h1>
        </div>
        <div>
          <button className="b1" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Mode Clair' : '🌙 Mode Sombre'}
          </button>
          <button className="logout-btn" onClick={() => navigate('/')}>Déconnecter</button>
        </div>
      </header>

      <div className="home-container">
        <div className="filters">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">-- Filtrer par statut --</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
            <option value="">-- Filtrer par priorité --</option>
            <option value="Haute">Haute</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="">-- Filtrer par catégorie --</option>
            <option value="Personnel">Personnel</option>
            <option value="Travail">Travail</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <form onSubmit={handleAddOrEditTask} className="task-form">
          <input type="text" placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} required />
          <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="Personnel">Personnel</option>
            <option value="Travail">Travail</option>
            <option value="Autre">Autre</option>
          </select>
          <select value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="Haute">Haute</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required />
          <button type="submit">{editingTaskId ? 'Enregistrer' : 'Ajouter'}</button>
        </form>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="kanban-board">
            {statuses.map(statusKey => (
              <Droppable droppableId={statusKey} key={statusKey}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="kanban-column">
                    <h2>{statusKey}</h2>
                    {filteredColumns[statusKey].map((task, index) => {
                      const isLate = isOverdue(task.deadline);
                      const isClose = isDeadlineClose(task.deadline);
                      return (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`task-card ${priorityClassMap[task.priority]} ${snapshot.isDragging ? 'dragging' : ''} ${isLate ? 'overdue' : ''} ${isClose ? 'deadline-close' : ''}`}
                            >
                              <div className="task-card-header">
                                <h3>{task.title}</h3>
                                <div className="task-card-actions">
                                  <button onClick={() => handleEditClick(task, statusKey)} title="Modifier">✏️</button>
                                  <button onClick={() => handleDeleteTask(task.id)} title="Supprimer">❌</button>
                                </div>
                              </div>
                              <p>{task.description}</p>
                              <p>Catégorie: {task.category}</p>
                              <p>Priorité: {task.priority}</p>
                              <p>Échéance: {moment(task.deadline).format('DD/MM/YYYY')}</p>
                              {isLate && <p className="reminder">⚠️ Cette tâche est en retard !</p>}
                              {isClose && !isLate && <p className="reminder close">⏰ Échéance proche</p>}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default Home;





