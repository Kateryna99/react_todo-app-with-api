import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  FC,
  ReactNode,
} from 'react';
import { Todo } from '../types/Todo';
import { deleteTodoInTodoList } from '../hooks/useDeleteTodoFromList';
import { ErrorMessages } from '../enum/ErrorMessages';

interface ContextProps {
  todoLoadingStates: { [key: number]: boolean };
  setTodoLoading: (id: number, status: boolean) => void;
  setErrorMessage: (message: ErrorMessages) => void;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  todos: Todo[];
  errorMessage: string;
  handleDelete: (id: number) => void;
}

const TodoContext = createContext<ContextProps | undefined>(undefined);

const TodoProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoLoadingStates, setTodoLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.none,
  );

  const setTodoLoading = (id: number, loading: boolean) => {
    setTodoLoadingStates(prevState => ({ ...prevState, [id]: loading }));
  };

  const handleDelete = async (id: number) => {
    await deleteTodoInTodoList(id, setTodoLoading, setErrorMessage, setTodos);
  };

  const contextValue = {
    todoLoadingStates,
    setTodoLoading,
    setErrorMessage,
    setTodos,
    todos,
    errorMessage,
    handleDelete,
  };

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
};

const useTodosContext = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useTodosContext must be used within a TodoProvider');
  }

  return context;
};

export { TodoProvider, useTodosContext };
