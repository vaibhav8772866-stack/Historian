import React from 'react';
import { useNavigate } from 'react-router-dom';
import HistorianLoader from '../components/HistorianLoader';

export default function LoadingPage() {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/dashboard', { replace: true });
  };

  const handleSkip = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <HistorianLoader 
      onComplete={handleComplete} 
      onSkip={handleSkip} 
    />
  );
}
