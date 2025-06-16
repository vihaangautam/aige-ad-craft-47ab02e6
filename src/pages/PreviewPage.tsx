
import React from 'react';
import { PreviewPlayer } from '@/components/PreviewPlayer';
import { useNavigate } from 'react-router-dom';

export function PreviewPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/create');
  };

  return (
    <PreviewPlayer onBack={handleBack} />
  );
}
