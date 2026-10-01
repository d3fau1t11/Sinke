import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<div className="p-8"><h1 className="text-2xl font-bold">Senik Merchant</h1><p>Coming soon...</p></div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}