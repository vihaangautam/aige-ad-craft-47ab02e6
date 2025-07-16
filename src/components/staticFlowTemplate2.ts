export const choicePointNodes = [
  {
    id: "1",
    type: "storyNode",
    position: { x: 100, y: 250 },
    data: {
      nodeNumber: 1,
      title: "Opening Scene",
      description: "User enters the virtual showroom",
      nodeType: "Scene",
      optionA: {
        type: "upload",
        label: "Upload from Files",
        file: null,
        thumbnail: "",
        filename: "",
        videoURL: "",
      },
      optionB: {
        type: "workspace-import",
        label: "Import from Workspace",
        assetId: "",
        thumbnail: "",
        filename: "",
        videoURL: "",
      },
      videoA: null,
      videoB: null,
      uploadedFilePreviewUrl: "",
    },
  },
  {
    id: "2",
    type: "choice",
    position: { x: 500, y: 250 },
    data: {
      nodeNumber: 2,
      title: "New Choice Point",
      description: "What happens next?",
      nodeType: "Choice Point",
      options: [
        { label: "Option A text (e.g. 'Take the left door')", nextSceneId: "" },
        { label: "Option B text (e.g. 'Take the right door')", nextSceneId: "" },
      ],
    },
  },
  {
    id: "3",
    type: "storyNode",
    position: { x: 900, y: 100 },
    data: {
      nodeNumber: 3,
      title: "New Scene",
      description: "Description for scene",
      nodeType: "Scene",
      optionA: {
        type: "upload",
        label: "Upload from Files",
        file: null,
        thumbnail: "",
        filename: "",
        videoURL: "",
      },
      optionB: {
        type: "workspace-import",
        label: "Import from Workspace",
        assetId: "",
        thumbnail: "",
        filename: "",
        videoURL: "",
      },
      videoA: null,
      videoB: null,
      uploadedFilePreviewUrl: "",
    },
  },
  {
    id: "4",
    type: "storyNode",
    position: { x: 900, y: 400 },
    data: {
      nodeNumber: 4,
      title: "New Scene",
      description: "Description for scene",
      nodeType: "Scene",
      optionA: {
        type: "upload",
        label: "Upload from Files",
        file: null,
        thumbnail: "",
        filename: "",
        videoURL: "",
      },
      optionB: {
        type: "workspace-import",
        label: "Import from Workspace",
        assetId: "",
        thumbnail: "",
        filename: "",
        videoURL: "",
      },
      videoA: null,
      videoB: null,
      uploadedFilePreviewUrl: "",
    },
  },
];

export const choicePointEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" }, // Option 1
  { id: "e2-4", source: "2", target: "4" }, // Option 2
]; 