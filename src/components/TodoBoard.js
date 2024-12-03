import React from "react";
import TodoItem from "./TodoItem";

const TodoBoard = ({ todoList, deleteItem, toggleComplete }) => {
  return (
    <div>
      {todoList.length > 0 ? (
        todoList.map((item) => (
          <TodoItem
            item={item}
            key={item._id}
            deleteItem={deleteItem}
            toggleComplete={toggleComplete}
          />
        ))
      ) : (
        // 날짜별 할 일이 없을 때 메시지
        <p role="alert" className="no-tasks-message">
          선택한 날짜에 할 일이 없습니다.
        </p>
      )}
    </div>
  );
};

export default TodoBoard;
