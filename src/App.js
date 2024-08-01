import React, { useState, useEffect } from 'react';
import './App.css';

const initialPlants = [
  { id: 1, name: 'Rose', status: 'Healthy', lastWatered: '2024-08-01', wateringInterval: 3 },
  { id: 2, name: 'Tulip', status: 'Needs Water', lastWatered: '2024-07-25', wateringInterval: 5 }
];

function App() {
  const [plants, setPlants] = useState(initialPlants);
  const [newPlantName, setNewPlantName] = useState('');
  const [newPlantInterval, setNewPlantInterval] = useState(3);
  const [activeTab, setActiveTab] = useState('garden');

  useEffect(() => {
    const timer = setInterval(() => {
      const today = new Date();
      const updatedPlants = plants.map(plant => {
        const lastWatered = new Date(plant.lastWatered);
        const daysSinceWatered = Math.floor((today - lastWatered) / (1000 * 60 * 60 * 24));
        return {
          ...plant,
          status: daysSinceWatered >= plant.wateringInterval ? 'Needs Water' : 'Healthy'
        };
      });
      setPlants(updatedPlants);
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, [plants]);

  const addPlant = () => {
    if (newPlantName.trim() === '') return;

    const newPlant = {
      id: plants.length + 1,
      name: newPlantName,
      status: 'Healthy',
      lastWatered: new Date().toISOString().split('T')[0],
      wateringInterval: newPlantInterval
    };
    setPlants([...plants, newPlant]);
    setNewPlantName('');
    setNewPlantInterval(3);
  };

  const waterPlant = (id) => {
    const updatedPlants = plants.map(plant =>
      plant.id === id
        ? { ...plant, status: 'Healthy', lastWatered: new Date().toISOString().split('T')[0] }
        : plant
    );
    setPlants(updatedPlants);
  };

  const removePlant = (id) => {
    setPlants(plants.filter(plant => plant.id !== id));
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-logo">🌱 Virtual Garden</div>
        <ul className="nav-links">
          <li onClick={() => setActiveTab('garden')} className={activeTab === 'garden' ? 'active' : ''}>Garden</li>
          <li onClick={() => setActiveTab('add')} className={activeTab === 'add' ? 'active' : ''}>Add Plant</li>
        </ul>
      </nav>

      <main>
        {activeTab === 'garden' && (
          <div className="plant-list">
            {plants.map(plant => (
              <div key={plant.id} className={`plant-card ${plant.status.toLowerCase().replace(' ', '-')}`}>
                <h2>{plant.name}</h2>
                <p>Status: {plant.status}</p>
                <p>Last Watered: {plant.lastWatered}</p>
                <p>Watering Interval: Every {plant.wateringInterval} days</p>
                <button onClick={() => waterPlant(plant.id)} className="water-btn">💧 Water Plant</button>
                <button onClick={() => removePlant(plant.id)} className="remove-btn">🗑️ Remove</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="add-plant-form">
            <h2>Add New Plant</h2>
            <input
              type="text"
              value={newPlantName}
              onChange={(e) => setNewPlantName(e.target.value)}
              placeholder="Enter plant name"
            />
            <input
              type="number"
              value={newPlantInterval}
              onChange={(e) => setNewPlantInterval(parseInt(e.target.value))}
              placeholder="Watering interval (days)"
              min="1"
            />
            <button onClick={addPlant}>Add Plant</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;