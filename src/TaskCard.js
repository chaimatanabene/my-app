import React from 'react';
import moment from 'moment';
import { Draggable } from '@hello-pangea/dnd'; 
const TaskCard = React.memo(({ task, index, handleEditClick, handleDeleteTask }) => {
  const priorityClass =
    task.priority === 'Haute' ? 'priority-haute' :
    task.priority === 'Moyenne' ? 'priority-moyenne' :
    'priority-basse';

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${priorityClass} ${snapshot.isDragging ? 'dragging' : ''}`}
        >
          <div className="task-card-header">
            <h3 className="task-card-title">{task.title}</h3>
            <div className="task-card-actions">
              <button onClick={() => handleEditClick(task)} className="edit-btn" title="Modifier">✏️</button>
              <button onClick={() => handleDeleteTask(task.id)} className="delete-btn" title="Supprimer">❌</button>
            </div>
          </div>
          <p className="task-card-desc">{task.description}</p>
          <p className="task-card-info">Catégorie: {task.category}</p>
          <p className="task-card-info">Échéance: {moment(task.deadline).format('DD/MM/YYYY')}</p>
        </div>
      )}
    </Draggable>
  );
});

export default TaskCard;
