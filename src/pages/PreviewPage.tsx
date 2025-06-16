
import { PreviewPlayer } from '@/components/PreviewPlayer';
import { useNavigate } from 'react-router-dom';

export function PreviewPage() {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/create');
  };

  return <PreviewPlayer onExit={handleExit} />;
}
