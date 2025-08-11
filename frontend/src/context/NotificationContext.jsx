import React, { createContext, useContext, useMemo, useState } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [messages, setMessages] = useState([]);

  function notify(type, text) {
    const id = `${Date.now()}_${Math.random()}`;
    setMessages((prev) => [...prev, { id, type, text }]);
    setTimeout(() => dismiss(id), 4000);
  }

  function dismiss(id) {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  const value = useMemo(() => ({ messages, notify, dismiss }), [messages]);
  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', right: 16, bottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map((m) => (
          <div key={m.id} className="card">
            <strong>{m.type?.toUpperCase()}</strong>
            <div>{m.text}</div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}


