import React from 'react';

const PageLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      {/* Le cercle qui tourne */}
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      
      {/* Petit texte en dessous */}
      <p className="mt-4 text-slate-500 font-medium animate-pulse">
        Chargement d'ImoRénov...
      </p>
    </div>
  );
};

export default PageLoader;