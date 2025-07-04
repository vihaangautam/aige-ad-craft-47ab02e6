import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { configsAPI } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useFlow } from "./FlowContext";
import { defaultNodes, defaultEdges } from "./staticFlowTemplate";

interface StoryAdConfigFormProps {
  onBack: () => void;
  onNext: () => void;
}

export interface StoryAdConfigFormProps { // Made exportable for CreateAdPage
  onBack: () => void;
  onNext: (adConfigId?: string) => void; // Modified to pass adConfigId
}

export function StoryAdConfigForm({ onBack, onNext }: StoryAdConfigFormProps) {
  const [themePrompt, setThemePrompt] = useState("");
  const [tone, setTone] = useState("");
  const [elements, setElements] = useState<string[]>([]);
  const [newElement, setNewElement] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { setNodes, setEdges, setIsStaticTemplate } = useFlow();

  const toneOptions = [
    { value: "emotional", label: "Emotional" },
    { value: "suspenseful", label: "Suspenseful" },
    { value: "funny", label: "Funny" },
    { value: "dramatic", label: "Dramatic" },
  ];

  const handleAddElement = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newElement.trim()) {
      e.preventDefault();
      if (!elements.includes(newElement.trim())) {
        setElements([...elements, newElement.trim()]);
      }
      setNewElement("");
    }
  };

  const removeElement = (elementToRemove: string) => {
    setElements(elements.filter((el) => el !== elementToRemove));
  };

  const saveAdConfiguration = async () => {
    // Always include the current input in the elements list
    let finalElements = elements;
    if (newElement.trim() && !elements.includes(newElement.trim())) {
      finalElements = [...elements, newElement.trim()];
    }

    if (!themePrompt.trim() || !tone) {
      toast({
        title: "Validation Error",
        description: "Please fill in theme prompt and tone",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);
    try {
      const configData = {
        theme_prompt: themePrompt,
        tone,
        characters_or_elements: finalElements.join(', '),
      };

      const response = await configsAPI.create(configData); // Capture response
      const newConfigId = response.data.id; // Assuming id is in response.data.id
      
      if (!newConfigId) {
        console.error("Failed to get newConfigId from response:", response);
        toast({
          title: "Error",
          description: "Failed to get ID from new configuration.",
          variant: "destructive"
        });
        return null; // Indicate failure by returning null for the ID
      }

      // Store config in localStorage for the flow builder (include ID)
      const configToStore = { ...configData, id: newConfigId };
      localStorage.setItem('currentAdConfig', JSON.stringify(configToStore));
      localStorage.setItem('currentAdConfigId', newConfigId); // Also store ID separately if needed
      
      toast({
        title: "Success",
        description: "Ad configuration saved successfully!",
      });
      
      return newConfigId; // Return the new ID
    } catch (error: any) {
      console.error("Failed to save config:", error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to save configuration",
        variant: "destructive"
      });
      return null; // Indicate failure
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    const newConfigId = await saveAdConfiguration();
    if (newConfigId) {
      setNodes(defaultNodes);
      setEdges(defaultEdges);
      setIsStaticTemplate(true);
      onNext(newConfigId); // Pass the newConfigId to the onNext callback
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-black mb-2">Configure Your Story Ad</h1>
        <p className="text-gray-600">Set up the theme, tone, and elements for your immersive AR story</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-8">
        {/* Theme Prompt */}
        <div className="space-y-3">
          <Label htmlFor="theme-prompt" className="text-lg font-semibold text-black">Theme Prompt</Label>
          <Textarea
            id="theme-prompt"
            placeholder="Fathers Day emotional ad in a village"
            value={themePrompt}
            onChange={(e) => setThemePrompt(e.target.value)}
            className="min-h-[120px] text-base border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
          />
          <p className="text-sm text-gray-500">Describe the overall theme and setting for your story ad</p>
        </div>

        {/* Tone Selection */}
        <div className="space-y-3">
          <Label htmlFor="tone" className="text-lg font-semibold text-black">Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="text-base border-gray-300 focus:border-yellow-400 focus:ring-yellow-400">
              <SelectValue placeholder="Select the tone for your story" />
            </SelectTrigger>
            <SelectContent>
              {toneOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Elements */}
        <div className="space-y-3">
          <Label htmlFor="elements" className="text-lg font-semibold text-black">Characters or Elements</Label>
          <div className="space-y-3">
            <Input
              id="elements"
              placeholder="Add elements like 'Father', 'Child', 'Village'"
              value={newElement}
              onChange={(e) => setNewElement(e.target.value)}
              onKeyDown={handleAddElement}
              className="text-base border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
            />
            <p className="text-sm text-gray-500">Press Enter to add each element</p>
            {elements.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {elements.map((element, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-yellow-50 border-yellow-200 text-black hover:bg-yellow-100 px-3 py-1"
                  >
                    {element}
                    <button
                      onClick={() => removeElement(element)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="border-gray-300 hover:border-yellow-400 hover:text-yellow-600"
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button 
          onClick={handleNext}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-8"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 mr-2 border border-black border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Next: Build Story Flow
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}