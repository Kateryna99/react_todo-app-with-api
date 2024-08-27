import { updateTodo } from '../api/todos';
import { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodoInTodoList } from '../hooks/useDeleteTodoFromList';
import { ErrorMessages } from '../enum/ErrorMessages';

interface Props {
  newTitle: string;
  setTodoLoading: (id: number, status: boolean) => void;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  onCancel: (() => void) | undefined;
  setErrorMessage: (message: ErrorMessages) => void;
  id: number;
  onSave: (() => void) | undefined;
}

export const updateTodoForm = async ({
  newTitle,
  setTodoLoading,
  setTodos,
  setErrorMessage,
  id,
  onSave,
}: Props) => {
  const trimmedTitle = newTitle.trim();

  try {
    setErrorMessage(ErrorMessages.none);
    if (!trimmedTitle.length) {
      await deleteTodoInTodoList(id, setTodoLoading, setErrorMessage, setTodos);
    } else {
      setTodoLoading(id, true);
      await updateTodo(id, { title: trimmedTitle });
      setTodos(prevTodos =>
        prevTodos.map(item =>
          item.id === id ? { ...item, title: trimmedTitle } : item,
        ),
      );
      onSave?.();
    }
  } catch (error) {
    setErrorMessage(
      !trimmedTitle.length ? ErrorMessages.delete : ErrorMessages.edit,
    );
  } finally {
    setTodoLoading(id, false);
  }
};
