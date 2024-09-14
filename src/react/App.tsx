import { useState } from 'react';
import { sandboxApi } from './rpc';

function App() {
  const [count, setCount] = useState(5);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const num = Number(target.value);
    if (!isNaN(num)) {
      setCount(num);
    } else {
      setCount(0);
    }
  };

  const handleCreate = () => {
    sandboxApi.createRectangles(count);
  };

  return (
    <div className="App">
      <h2>Rectangle Creator</h2>
      <p>
        Count: <input id="count" value={count} onChange={handleChange} />
      </p>
      <button id="create" onClick={handleCreate}>
        Create
      </button>
    </div>
  );
}

export default App;
