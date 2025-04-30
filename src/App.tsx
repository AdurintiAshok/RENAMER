import React from 'react';
import ImageRenamer from './components/ImageRenamer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <ImageRenamer />
      </div>
    </div>
  );
}

export default App;