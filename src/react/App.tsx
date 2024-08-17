import { useEffect, useState } from 'react';
import manifest from '../../manifest.json';

const pluginId = manifest.id;

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handler = () => {
      document.getElementById('create').onclick = () => {
        const textbox = document.getElementById('count');
        const count = parseInt(textbox.value, 10);
        parent.postMessage({ pluginMessage: { type: 'create-rectangles', count }, pluginId }, '*');
      };

      document.getElementById('cancel').onclick = () => {
        parent.postMessage({ pluginMessage: { type: 'cancel' }, pluginId }, '*');
      };
    };
    handler();
  }, []);

  return (
    <div className="App">
      <h2>Rectangle Creator????</h2>
      <p>
        Count: <input id="count" value="5" />
      </p>
      <button id="create">Create</button>
      <button id="cancel">Cancel</button>
    </div>
  );
}

export default App;
