import { useEffect, useState } from "react";
import { generateClient } from "@aws-amplify/datastore"; // aws-amplify/data から aws-amplify/datastore に変更
import { Todo } from "../models"; // import type { Schema } from "../amplify/data/resource"; を削除

const client = generateClient(); // generateClient<Schema>(); を generateClient(); に変更

function App() {
  const [todos, setTodos] = useState<Todo[]>([]); // Array<Schema["Todo"]["type"]> を Todo[] に変更

  useEffect(() => {
    const subscription = client.observe(Todo).subscribe({ // client.models.Todo.observeQuery() を client.observe(Todo) に変更
      next: (data) => setTodos([...data]), // data.items を data に変更
    });

    return () => subscription.unsubscribe(); // useEffect 内でのクリーンアップ追加
  }, []);

  function createTodo() {
    client.create(new Todo({ content: window.prompt("Todo content") })); // client.models.Todo.create({ content: window.prompt("Todo content") }); を修正
  }
  
  function deleteTodo(id: string) {
    client.delete(Todo, id); // client.models.Todo.delete({ id }); を修正
  }
  
  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li 
            onClick={() => deleteTodo(todo.id)}
            key={todo.id}
          >
            {todo.content}
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
