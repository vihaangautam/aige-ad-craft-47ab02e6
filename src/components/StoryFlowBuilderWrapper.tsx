import { ReactFlowProvider } from '@xyflow/react';
import { StoryFlowBuilder } from './StoryFlowBuilder';

export default function StoryFlowBuilderWrapper(props: any) {
  return (
    <ReactFlowProvider>
      <StoryFlowBuilder {...props} />
    </ReactFlowProvider>
  );
} 