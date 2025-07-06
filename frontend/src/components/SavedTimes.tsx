
import { useState, useEffect } from 'react';
import Average from './Average';

function SavedTimes({ refresh }: { refresh: boolean }) {
  const [savedTimes, setSavedTimes] = useState<number[]>([]);

  useEffect(() => {
    async function fetchTimes() {
      try {
        const res = await fetch('http://localhost:5000/api/times');
        const data = await res.json();
        const times = data.map((entry: { time: number }) => entry.time);
        setSavedTimes(times);
      } catch (err) {
        console.error("Failed to fetch times:", err);
      }
    }
    fetchTimes();
  }, [refresh]);

  return (
    <div>
      <Average times={savedTimes} />
      <h2>Saved Times</h2>
      {savedTimes.map((t, i) => (
        <p key={i} className="savedTimesList">{(t / 1000).toFixed(3)}s</p>
      ))}

    </div>
  );
}

export default SavedTimes;
