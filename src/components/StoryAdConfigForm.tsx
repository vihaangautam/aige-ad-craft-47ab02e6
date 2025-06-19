import axios from 'axios';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, ArrowLeft, ArrowRight } from "lucide-react";

interface StoryAdConfigFormProps {
  onBack: () => void;
  onNext: () => void;
}

export function StoryAdConfigForm({ onBack, onNext }: StoryAdConfigFormProps) {
  const [themePrompt, setThemePrompt] = useState("");
  const [tone, setTone] = useState("");
  const [elements, setElements] = useState<string[]>([]);
  const [newElement, setNewElement] = useState("");
  const [enableARFilters, setEnableARFilters] = useState(true);
  const [includeMiniGame, setIncludeMiniGame] = useState(true);

  const toneOptions = [
    { value: "emotional", label: "Emotional" },
    { value: "suspenseful", label: "Suspenseful" },
    { value: "funny", label: "Funny" },
    { value: "dramatic", label: "Dramatic" }
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
    setElements(elements.filter(element => element !== elementToRemove));
  };

  const saveAdConfiguration = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/configs/', {
        theme_prompt: themePrompt,
        tone: tone,
        characters_or_elements: elements.join(', '),
        enable_ar_filters: enableARFilters,
        include_mini_game: includeMiniGame,
      });
      console.log('✅ Config saved:', res.data);
    } catch (err) {
      console.error('❌ Failed to save config:', err);
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

        {/* Characters or Elements */}
        <div className="space-y-3">
          <Label htmlFor="elements" className="text-lg font-semibold text-black">Characters or Elements</Label>
          <div className="space-y-3">
            <Input
              id="elements"
              placeholder="Add elements like 'Father', 'Child', 'Village', 'Festival'"
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

        {/* Toggle Options */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-black">Additional Features</h3>

          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div className="space-y-1">
              <Label className="text-base font-medium text-black">Enable AR Effects</Label>
              <p className="text-sm text-gray-600">Add interactive AR visual effects to your story</p>
            </div>
            <Switch
              checked={enableARFilters}
              onCheckedChange={setEnableARFilters}
              className="data-[state=checked]:bg-yellow-400"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div className="space-y-1">
              <Label className="text-base font-medium text-black">Include Mini Game Module</Label>
              <p className="text-sm text-gray-600">Add gamification elements to increase engagement</p>
            </div>
            <Switch
              checked={includeMiniGame}
              onCheckedChange={setIncludeMiniGame}
              className="data-[state=checked]:bg-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="border-gray-300 hover:border-yellow-400 hover:text-yellow-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button 
          onClick={async () => {
            await saveAdConfiguration();
            onNext();
          }}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-8"
        >
          Next: Build Story Flow
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
