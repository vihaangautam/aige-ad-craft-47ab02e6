import LinearStagePreview from '@/components/LinearStagePreview';
import { useNavigate } from 'react-router-dom';

export function PreviewPage() {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/create');
  };

  return <LinearStagePreview />;
}
