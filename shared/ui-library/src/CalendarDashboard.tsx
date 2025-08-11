import React, { useEffect, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const mockEvents = [
  {
    title: 'Team Meeting',
    start: new Date(),
    end: new Date(),
    allDay: false,
  },
  {
    title: 'Project Deadline',
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    end: new Date(new Date().setDate(new Date().getDate() + 2)),
    allDay: true,
  },
];

const CalendarDashboard: React.FC = () => {
  const [tab, setTab] = useState<'big' | 'full'>('big');
  const [location, setLocation] = useState<string>('');
  const [weather, setWeather] = useState<string>('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Use OpenWeatherMap for demo (replace with your API key)
        const apiKey = 'demo'; // Replace with your real API key
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const res = await fetch(url);
        const data = await res.json();
        setWeather(data.current_weather ? `${data.current_weather.temperature}°C, ${data.current_weather.weathercode}` : '');
        // Reverse geocode for city name
        const locRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const locData = await locRes.json();
        setLocation(locData.address?.city || locData.address?.town || locData.address?.village || '');
      });
    }
  }, []);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '18px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      padding: '2rem',
      marginBottom: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Calendar</h2>
          <div style={{ color: '#a0aec0', fontSize: '1rem', marginTop: '0.25rem' }}>
            {location && weather ? (
              <>
                <span role="img" aria-label="location">📍</span> {location} &nbsp;|&nbsp; <span role="img" aria-label="weather">☁️</span> {weather}
              </>
            ) : (
              <span>Detecting location & weather...</span>
            )}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
          <button onClick={() => setTab('big')} style={{
            background: tab === 'big' ? 'rgba(67,233,123,0.15)' : 'transparent',
            border: '1px solid #43e97b',
            color: '#43e97b',
            borderRadius: '8px',
            padding: '0.5rem 1.25rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>Modern Calendar</button>
          <button onClick={() => setTab('full')} style={{
            background: tab === 'full' ? 'rgba(102,126,234,0.15)' : 'transparent',
            border: '1px solid #667eea',
            color: '#667eea',
            borderRadius: '8px',
            padding: '0.5rem 1.25rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>Google-Style Calendar</button>
        </div>
      </div>
      <div style={{ minHeight: 500 }}>
        {tab === 'big' ? (
          <BigCalendar
            localizer={localizer}
            events={mockEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, borderRadius: '12px', background: 'rgba(255,255,255,0.12)' }}
          />
        ) : (
          <div style={{ borderRadius: '12px', background: 'rgba(255,255,255,0.12)' }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              height={500}
              events={mockEvents.map(e => ({ title: e.title, start: e.start, end: e.end }))}
              headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
              dayMaxEvents={2}
              eventColor="#43e97b"
              eventTextColor="#222"
            />
          </div>
        )}
      </div>
      {/* AI Suggestions Sidebar (placeholder) */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        right: '-320px',
        width: '300px',
        background: 'rgba(67,233,123,0.12)',
        borderRadius: '16px',
        boxShadow: '0 4px 24px 0 rgba(67,233,123,0.15)',
        padding: '1.5rem',
        color: '#43e97b',
        fontWeight: 600,
        fontSize: '1.1rem',
        zIndex: 10,
        transition: 'right 0.3s',
      }}>
        <div>🤖 <b>AI Suggestions</b></div>
        <ul style={{ margin: '1rem 0 0 0', padding: 0, listStyle: 'none' }}>
          <li>• Smart scheduling tips</li>
          <li>• Conflict detection</li>
          <li>• Productivity insights</li>
          <li>• Personalized reminders</li>
        </ul>
      </div>
    </div>
  );
};

export default CalendarDashboard;
