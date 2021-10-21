import { useState } from 'react';
import './App.css';
import Instructions from './Instructions';
import Trigger from './Trigger';
import SelectedOutput from './SelectedOutput';
import Spotlight from './Spotlight/Spotlight';

function App() {
  const [selected, setSelected] = useState();
  const [spotlightVisible, setSpotlightVisible] = useState(false);

  const handleTrigger = () => setSpotlightVisible(!spotlightVisible);

  return (
    <div className="App">
      <Instructions />
      <div className="Implementation">
        <Trigger onTrigger={handleTrigger} />

        <Spotlight
          setSelected={setSelected}
          spotlightVisible={spotlightVisible}
          setSpotlightVisible={setSpotlightVisible}
        />

        <SelectedOutput selected={selected} />
      </div>
    </div>
  );
}

export default App;
