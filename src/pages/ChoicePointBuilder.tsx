import { ReactFlowProvider } from "@xyflow/react";
import { StoryFlowBuilder2 } from "@/components/StoryFlowBuilder2";
import { choicePointNodes, choicePointEdges } from "@/components/staticFlowTemplate2";

export default function ChoicePointBuilder(props: any) {
  return (
    <ReactFlowProvider>
      <StoryFlowBuilder2
        {...props}
        initialNodes={choicePointNodes}
        initialEdges={choicePointEdges}
        isStaticTemplate={true}
      />
    </ReactFlowProvider>
  );
} 