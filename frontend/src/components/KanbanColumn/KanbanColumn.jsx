import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from '../TaskCard/TaskCard';
import styles from './KanbanColumn.module.css';

const STATUS_MAP = {
  'To Do': 'todo',
  'In Progress': 'inprogress',
  Completed: 'completed',
};

export default function KanbanColumn({ title, tasks, droppableId }) {
  const statusClass = STATUS_MAP[title] || 'todo';

  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <div className={`${styles.statusDot} ${styles[statusClass]}`} />
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div className={styles.count}>{tasks.length}</div>
      </div>

      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            className={`${styles.cardList} ${snapshot.isDraggingOver ? styles.draggingOver : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(dragProvided) => (
                  <TaskCard task={task} provided={dragProvided} />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
