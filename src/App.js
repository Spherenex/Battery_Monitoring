// import { useState, useEffect } from 'react';
// import { initializeApp } from 'firebase/app';
// import { getDatabase, ref, onValue } from 'firebase/database';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
// import './App.css';

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyB9ererNsNonAzH0zQo_GS79XPOyCoMxr4",
//   authDomain: "waterdtection.firebaseapp.com",
//   databaseURL: "https://waterdtection-default-rtdb.firebaseio.com",
//   projectId: "waterdtection",
//   storageBucket: "waterdtection.firebasestorage.app",
//   messagingSenderId: "690886375729",
//   appId: "1:690886375729:web:172c3a47dda6585e4e1810",
//   measurementId: "G-TXF33Y6XY0"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// const App = () => {
//   // State for current values
//   const [batteryData, setBatteryData] = useState({
//     battery_percent: 0,
//     current: 0,
//     power: 0,
//     timestamp: '',
//     uploaded_at: '',
//     voltage: 0
//   });

//   // State for historical data (for graphs)
//   const [batteryHistory, setBatteryHistory] = useState({
//     battery_percent: [],
//     current: [],
//     power: [],
//     voltage: []
//   });

//   // Maximum number of points to show in graphs
//   const MAX_HISTORY_POINTS = 20;

//   useEffect(() => {
//     // Reference to the Battery_Monitoring/latest path in Firebase
//     const batteryRef = ref(database, 'Battery_Monitoring/latest');

//     // Set up real-time listener
//     const unsubscribe = onValue(batteryRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         // Update current values
//         setBatteryData(data);

//         // Update historical data for graphs
//         setBatteryHistory(prevHistory => {
//           const newHistory = { ...prevHistory };
          
//           // Add new data points with timestamps
//           const timestamp = new Date().toLocaleTimeString();
          
//           // For each metric, add new point and limit array length
//           Object.keys(newHistory).forEach(key => {
//             if (data[key] !== undefined) {
//               newHistory[key] = [
//                 ...prevHistory[key], 
//                 { time: timestamp, value: parseFloat(data[key]) }
//               ].slice(-MAX_HISTORY_POINTS);
//             }
//           });
          
//           return newHistory;
//         });
//       }
//     });

//     // Clean up listener on component unmount
//     return () => unsubscribe();
//   }, []);

//   // Generate a color based on battery percentage
//   const getBatteryColor = (percentage) => {
//     if (percentage < 20) return 'rgba(255, 77, 77, 0.8)'; // Red with opacity
//     if (percentage < 50) return 'rgba(255, 173, 51, 0.8)'; // Orange with opacity
//     return 'rgba(71, 209, 71, 0.8)'; // Green with opacity
//   };

//   // Format timestamp for display
//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return 'N/A';
//     return timestamp.replace('T', ' ').substring(0, 19);
//   };

//   return (
//     <div className="dashboard">
//       <header className="dashboard-header">
//         <h1>Battery Monitoring Dashboard</h1>
//         <div className="last-update">
//           Last Update: {formatTimestamp(batteryData.uploaded_at)}
//         </div>
//       </header>

//       <div className="dashboard-content">
//         {/* Main metrics cards */}
//         <div className="metrics-row">
//           {/* Battery Percentage Card */}
//           <div className="metric-card">
//             <div className="metric-title">Battery Percentage</div>
//             <div 
//               className="metric-value" 
//               style={{ color: getBatteryColor(batteryData.battery_percent) }}
//             >
//               {batteryData.battery_percent}%
//             </div>
//             <div className="battery-visual">
//               <div 
//                 className="battery-level" 
//                 style={{ 
//                   width: `${Math.max(1, batteryData.battery_percent)}%`,
//                   backgroundColor: getBatteryColor(batteryData.battery_percent)
//                 }}
//               ></div>
//             </div>
//           </div>

//           {/* Current Card */}
//           <div className="metric-card">
//             <div className="metric-title">Current</div>
//             <div className="metric-value">{batteryData.current} A</div>
//           </div>

//           {/* Power Card */}
//           <div className="metric-card">
//             <div className="metric-title">Power</div>
//             <div className="metric-value">{batteryData.power} W</div>
//           </div>

//           {/* Voltage Card */}
//           <div className="metric-card">
//             <div className="metric-title">Voltage</div>
//             <div className="metric-value">{batteryData.voltage} V</div>
//           </div>
//         </div>

//         {/* Graphs row */}
//         <div className="graphs-row">
//           {/* Battery Percentage Graph */}
//           <div className="graph-card">
//             <div className="graph-title">Battery Percentage History</div>
//             <div className="graph-container">
//               <ResponsiveContainer width="100%" height={200}>
//                 <AreaChart data={batteryHistory.battery_percent}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="time" tick={{ fontSize: 10 }} />
//                   <YAxis domain={[0, 100]} />
//                   <Tooltip />
//                   <defs>
//                     <linearGradient id="batteryGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#ff9a9e" stopOpacity={0.8}/>
//                       <stop offset="95%" stopColor="#ff9a9e" stopOpacity={0.2}/>
//                     </linearGradient>
//                   </defs>
//                   <Area 
//                     type="monotone" 
//                     dataKey="value" 
//                     stroke="#ff9a9e" 
//                     strokeWidth={2}
//                     fillOpacity={1}
//                     fill="url(#batteryGradient)"
//                     isAnimationActive={true}
//                     animationDuration={1500}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Current Graph */}
//           <div className="graph-card">
//             <div className="graph-title">Current History</div>
//             <div className="graph-container">
//               <ResponsiveContainer width="100%" height={200}>
//                 <AreaChart data={batteryHistory.current}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="time" tick={{ fontSize: 10 }} />
//                   <YAxis />
//                   <Tooltip />
//                   <defs>
//                     <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#a1c4fd" stopOpacity={0.8}/>
//                       <stop offset="95%" stopColor="#a1c4fd" stopOpacity={0.2}/>
//                     </linearGradient>
//                   </defs>
//                   <Area 
//                     type="monotone" 
//                     dataKey="value" 
//                     stroke="#a1c4fd" 
//                     strokeWidth={2}
//                     fillOpacity={1}
//                     fill="url(#currentGradient)"
//                     isAnimationActive={true}
//                     animationDuration={1500}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         <div className="graphs-row">
//           {/* Power Graph */}
//           <div className="graph-card">
//             <div className="graph-title">Power History</div>
//             <div className="graph-container">
//               <ResponsiveContainer width="100%" height={200}>
//                 <AreaChart data={batteryHistory.power}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="time" tick={{ fontSize: 10 }} />
//                   <YAxis />
//                   <Tooltip />
//                   <defs>
//                     <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#ffecd2" stopOpacity={0.8}/>
//                       <stop offset="95%" stopColor="#fcb69f" stopOpacity={0.2}/>
//                     </linearGradient>
//                   </defs>
//                   <Area 
//                     type="monotone" 
//                     dataKey="value" 
//                     stroke="#fcb69f" 
//                     strokeWidth={2}
//                     fillOpacity={1}
//                     fill="url(#powerGradient)"
//                     isAnimationActive={true}
//                     animationDuration={1500}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Voltage Graph */}
//           <div className="graph-card">
//             <div className="graph-title">Voltage History</div>
//             <div className="graph-container">
//               <ResponsiveContainer width="100%" height={200}>
//                 <AreaChart data={batteryHistory.voltage}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="time" tick={{ fontSize: 10 }} />
//                   <YAxis />
//                   <Tooltip />
//                   <defs>
//                     <linearGradient id="voltageGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#84fab0" stopOpacity={0.8}/>
//                       <stop offset="95%" stopColor="#8fd3f4" stopOpacity={0.2}/>
//                     </linearGradient>
//                   </defs>
//                   <Area 
//                     type="monotone" 
//                     dataKey="value" 
//                     stroke="#84fab0" 
//                     strokeWidth={2}
//                     fillOpacity={1}
//                     fill="url(#voltageGradient)"
//                     isAnimationActive={true}
//                     animationDuration={1500}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;

import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

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
    uploaded_at: new Date().toISOString(),
    voltage: 0
  });

  // Electricity cost calculation
  const [electricityCost, setElectricityCost] = useState({
    hourly: 0,
    daily: 0,
    monthly: 0
  });

  // Cost per kWh (can be adjusted)
  const COST_PER_KWH = 6; // ₹6 per kWh - typical rate in India

  // State for historical data (for graphs)
  const [batteryHistory, setBatteryHistory] = useState({
    battery_percent: [],
    current: [],
    power: [],
    voltage: [],
    cost: []
  });

  // Maximum number of points to show in graphs
  const MAX_HISTORY_POINTS = 20;

  useEffect(() => {
    // Calculate electricity cost whenever power changes
    // If power is 0 or undefined, try to calculate it from voltage and current
    let powerToUse = batteryData.power;
    
    if (!powerToUse && batteryData.voltage && batteryData.current) {
      powerToUse = batteryData.voltage * batteryData.current;
      console.log('Power recalculated in cost calculation:', powerToUse, 'W');
    }
    
    const powerInKW = powerToUse / 1000; // Convert W to kW
    const hourlyCost = powerInKW * COST_PER_KWH;
    const dailyCost = hourlyCost * 24;
    const monthlyCost = dailyCost * 30;

    // Log the calculations for debugging
    console.log('Power used for calculation:', powerToUse, 'W');
    console.log('Power in kW:', powerInKW, 'kW');
    console.log('Cost per kWh:', COST_PER_KWH, '₹/kWh');
    console.log('Hourly cost:', hourlyCost, '₹/hr');
    console.log('Daily cost:', dailyCost, '₹/day');
    console.log('Monthly cost:', monthlyCost, '₹/month');

    setElectricityCost({
      hourly: hourlyCost,
      daily: dailyCost,
      monthly: monthlyCost
    });

    // Update cost history
    const timestamp = new Date().toLocaleTimeString();
    setBatteryHistory(prevHistory => {
      const newHistory = { ...prevHistory };
      newHistory.cost = [
        ...prevHistory.cost || [], 
        { time: timestamp, value: hourlyCost }
      ].slice(-MAX_HISTORY_POINTS);
      return newHistory;
    });
  }, [batteryData.power, batteryData.voltage, batteryData.current]);

  useEffect(() => {
    // Reference to the Battery_Monitoring/latest path in Firebase
    const batteryRef = ref(database, 'Battery_Monitoring/latest');

    // Set up real-time listener
    const unsubscribe = onValue(batteryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Update current values
        
        // If power is not available in the data, calculate it from voltage and current
        const updatedData = {...data};
        if (!updatedData.power && updatedData.voltage && updatedData.current) {
          updatedData.power = (updatedData.voltage * updatedData.current).toFixed(2);
          console.log('Power calculated:', updatedData.power, 'W (Voltage:', updatedData.voltage, 'V × Current:', updatedData.current, 'A)');
        }
        
        setBatteryData(updatedData);

        // Update historical data for graphs
        setBatteryHistory(prevHistory => {
          const newHistory = { ...prevHistory };
          
          // Add new data points with timestamps
          const timestamp = new Date().toLocaleTimeString();
          
          // For each metric, add new point and limit array length
          Object.keys(newHistory).forEach(key => {
            if (key !== 'cost' && updatedData[key] !== undefined) {
              newHistory[key] = [
                ...prevHistory[key] || [], 
                { time: timestamp, value: parseFloat(updatedData[key]) }
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

  // Format currency
  const formatCurrency = (amount) => {
    // Make sure we have at least 2 decimal places, but not more than needed
    // For small values (less than 1), show 2 decimal places
    // For larger values, show fewer decimal places if possible
    if (amount < 1) {
      return `₹${amount.toFixed(2)}`;
    } else if (amount < 10) {
      return `₹${Math.round(amount * 10) / 10}`;
    } else {
      return `₹${Math.round(amount)}`;
    }
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
          
          {/* New Electricity Cost Card */}
          <div className="metric-card" style={{ background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' }}>
            <div className="metric-title">Current Bill</div>
            <div className="metric-value" style={{ fontSize: '1.8rem' }}>{formatCurrency(electricityCost.hourly)}/hr</div>
            <div className="cost-details">
              <div>{formatCurrency(electricityCost.daily)}/day</div>
              <div>{formatCurrency(electricityCost.monthly)}/month</div>
            </div>
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
        
        {/* Cost History Graph */}
        <div className="graphs-row">
          <div className="graph-card" style={{ width: '100%' }}>
            <div className="graph-title">Electricity Cost History (₹/hr)</div>
            <div className="graph-container">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={batteryHistory.cost}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => {
                    // Better formatting in the tooltip
                    return [`₹${value.toFixed(3)}`, 'Cost/hr'];
                  }} />
                  <defs>
                    <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f6d365" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#fda085" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#fda085" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#costGradient)"
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .dashboard {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
          padding: 20px;
          min-height: 100vh;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        
        .dashboard-header h1 {
          color: #333;
          font-weight: 600;
          margin: 0;
        }
        
        .last-update {
          color: #666;
          font-size: 14px;
        }
        
        .dashboard-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .metrics-row {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .metric-card {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          flex: 1;
          min-width: 180px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .metric-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }
        
        .metric-title {
          font-size: 14px;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 10px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        .metric-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 10px;
        }
        
        .battery-visual {
          height: 10px;
          background-color: #f0f0f0;
          border-radius: 5px;
          overflow: hidden;
        }
        
        .battery-level {
          height: 100%;
          border-radius: 5px;
          transition: width 1s ease-in-out, background-color 1s ease;
        }
        
        .graphs-row {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .graph-card {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          flex: 1;
          min-width: 45%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .graph-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }
        
        .graph-title {
          font-size: 16px;
          color: #555;
          margin-bottom: 15px;
          font-weight: 600;
        }
        
        .graph-container {
          height: 200px;
        }
        
        .cost-details {
          font-size: 0.9rem;
          color: rgba(0, 0, 0, 0.6);
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
};

export default App;