import { useState } from 'react';
import WorkoutForm from './components/WorkoutForm';
import WorkoutHistory from './components/WorkoutHistory';
import './App.css';

type Tab = 'record' | 'history';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('record');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setRefreshKey((k) => k + 1);
    setActiveTab('history');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>力量训练日记</h1>
      </header>

      <nav className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'record' ? 'active' : ''}`}
          onClick={() => setActiveTab('record')}
        >
          记录训练
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          训练历史
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'record' ? (
          <WorkoutForm onSaved={handleSaved} />
        ) : (
          <WorkoutHistory refreshKey={refreshKey} />
        )}
      </main>
    </div>
  );
}

export default App;
