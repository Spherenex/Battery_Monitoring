import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import './App.css';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9ererNsNonAzH0zQo_GS79XPOyCoMxr4",
  authDomain: "waterdtection.firebaseapp.com",
  databaseURL: "https://waterdtection-default-rtdb.firebaseio.com",
  projectId: "waterdtection",
  storageBucket: "waterdtection.firebasestorage.app",
  messagingSenderId: "690886375729",
  appId: "1:690886375729:web:172c3a47dda6585e4e1810",
  measurementId: "G-TXF33Y6XY0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const App = () => {
  // State for current values
  const [batteryData, setBatteryData] = useState({
    battery_percent: 0,
    current: 0,
    power: 0,
    timestamp: '',
    uploaded_at: '',
    voltage: 0
  });

  // State for historical data (for graphs)
  const [batteryHistory, setBatteryHistory] = useState({
    battery_percent: [],
    current: [],
    power: [],
    voltage: []
  });

  // Maximum number of points to show in graphs
  const MAX_HISTORY_POINTS = 20;

  useEffect(() => {
    // Reference to the Battery_Monitoring/latest path in Firebase
    const batteryRef = ref(database, 'Battery_Monitoring/latest');

    // Set up real-time listener
    const unsubscribe = onValue(batteryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Update current values
        setBatteryData(data);

        // Update historical data for graphs
        setBatteryHistory(prevHistory => {
          const newHistory = { ...prevHistory };
          
          // Add new data points with timestamps
          const timestamp = new Date().toLocaleTimeString();
          
          // For each metric, add new point and limit array length
          Object.keys(newHistory).forEach(key => {
            if (data[key] !== undefined) {
              newHistory[key] = [
                ...prevHistory[key], 
                { time: timestamp, value: parseFloat(data[key]) }
              ].slice(-MAX_HISTORY_POINTS);
            }
          });
          
          return newHistory;
        });
      }
    });

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, []);

  // Generate a color based on battery percentage
  const getBatteryColor = (percentage) => {
    if (percentage < 20) return 'rgba(255, 77, 77, 0.8)'; // Red with opacity
    if (percentage < 50) return 'rgba(255, 173, 51, 0.8)'; // Orange with opacity
    return 'rgba(71, 209, 71, 0.8)'; // Green with opacity
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return timestamp.replace('T', ' ').substring(0, 19);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Battery Monitoring Dashboard</h1>
        <div className="last-update">
          Last Update: {formatTimestamp(batteryData.uploaded_at)}
        </div>
      </header>

      <div className="dashboard-content">
        {/* Main metrics cards */}
        <div className="metrics-row">
          {/* Battery Percentage Card */}
          <div className="metric-card">
            <div className="metric-title">Battery Percentage</div>
            <div 
              className="metric-value" 
              style={{ color: getBatteryColor(batteryData.battery_percent) }}
            >
              {batteryData.battery_percent}%
            </div>
            <div className="battery-visual">
              <div 
                className="battery-level" 
                style={{ 
                  width: `${Math.max(1, batteryData.battery_percent)}%`,
                  backgroundColor: getBatteryColor(batteryData.battery_percent)
                }}
              ></div>
            </div>
          </div>

          {/* Current Card */}
          <div className="metric-card">
            <div className="metric-title">Current</div>
            <div className="metric-value">{batteryData.current} A</div>
          </div>

          {/* Power Card */}
          <div className="metric-card">
            <div className="metric-title">Power</div>
            <div className="metric-value">{batteryData.power} W</div>
          </div>

          {/* Voltage Card */}
          <div className="metric-card">
            <div className="metric-title">Voltage</div>
            <div className="metric-value">{batteryData.voltage} V</div>
          </div>
        </div>

        {/* Graphs row */}
        <div className="graphs-row">
          {/* Battery Percentage Graph */}
          <div className="graph-card">
            <div className="graph-title">Battery Percentage History</div>
            <div className="graph-container">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={batteryHistory.battery_percent}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <defs>
                    <linearGradient id="batteryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff9a9e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ff9a9e" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ff9a9e" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#batteryGradient)"
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Current Graph */}
          <div className="graph-card">
            <div className="graph-title">Current History</div>
            <div className="graph-container">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={batteryHistory.current}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <defs>
                    <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a1c4fd" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#a1c4fd" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#a1c4fd" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#currentGradient)"
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="graphs-row">
          {/* Power Graph */}
          <div className="graph-card">
            <div className="graph-title">Power History</div>
            <div className="graph-container">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={batteryHistory.power}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <defs>
                    <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffecd2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#fcb69f" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#fcb69f" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#powerGradient)"
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Voltage Graph */}
          <div className="graph-card">
            <div className="graph-title">Voltage History</div>
            <div className="graph-container">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={batteryHistory.voltage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <defs>
                    <linearGradient id="voltageGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#84fab0" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8fd3f4" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#84fab0" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#voltageGradient)"
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;