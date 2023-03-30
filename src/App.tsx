import * as React from 'react';
import { AdaptableAgGrid } from './AdaptableAgGrid';

const NUMBER_OF_ADAPTABLE_INSTANCES = 8;

function App() {
  const indexes = Array.from(Array(NUMBER_OF_ADAPTABLE_INSTANCES)).map(
    (x, i) => {
      return i + 1;
    },
  );
  return (
    <div className="multi-container">
      {indexes.map((indexValue) => {
        return (
          <div key={indexValue} className="multi-column">
            <AdaptableAgGrid
              instanceIndex={indexValue}
              headerBackground={generateBackgroundColor()}
            ></AdaptableAgGrid>
          </div>
        );
      })}
    </div>
  );
}

function generateBackgroundColor() {
  const h = Math.floor(Math.random() * 360);
  const randomDarkColor = `hsl(${h}deg, 50%, 30%)`;

  return randomDarkColor;
}

export default App;
