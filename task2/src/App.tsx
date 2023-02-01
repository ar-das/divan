import { CostInput } from './components/cost-input';

function App() {
  return (
    <div className='App'>
      <div>
        <CostInput max={1000000000000000} min={-120000000} />
        <CostInput max={1000000000000000} min={1} />
      </div>
    </div>
  );
}

export default App;
