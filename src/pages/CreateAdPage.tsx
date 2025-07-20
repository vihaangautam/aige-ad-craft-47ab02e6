import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { StoryAdConfigForm } from "@/components/StoryAdConfigForm";
import { StoryFlowBuilder } from "@/components/StoryFlowBuilder";
import { FlowProvider } from "@/components/FlowContext";
import StoryFlowBuilderWrapper from "@/components/StoryFlowBuilderWrapper";
import CreateAdEntry from "./CreateAdEntry";
import { useNavigate } from "react-router-dom";
import { scriptAPI } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface CreateAdPageProps {
  onNavigate: (path: string) => void;
}

const adTypes = [
  {
    id: "immersive-story",
    title: "Immersive Story Ad",
    description: "Create interactive storytelling experiences with AR elements",
    icon: Sparkles,
    popular: true
  }
];

import { StoryAdConfigFormProps } from "@/components/StoryAdConfigForm"; // Import props type

export function CreateAdPage({ onNavigate }: CreateAdPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAdType, setSelectedAdType] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null); // NEW: track template
  const [currentAdConfigId, setCurrentAdConfigId] = useState<string | null>(null); // Added state for adConfigId
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAdTypeSelect = (typeId: string) => {
    setSelectedAdType(typeId);
    setCurrentAdConfigId(null); // Reset adConfigId when ad type changes
    // If immersive-story, go to template selection (step 2), else go to config (step 2)
    if (typeId === "immersive-story") {
      setCurrentStep(2);
    } else {
      setCurrentStep(3);
    }
  };

  // NEW: handle template selection
  const handleTemplateSelect = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    localStorage.setItem('selectedTemplate', templateKey); // Persist selected template
    setCurrentStep(3); // Always go to config form after template selection
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 2) {
        setSelectedAdType(null);
      }
    } else {
      onNavigate("/");
    }
  };

  // This function will be passed to StoryAdConfigForm's onNext
  const handleConfigFormNext = async (adConfigId?: string) => {
    if (adConfigId) {
      setCurrentAdConfigId(adConfigId);
    }
    // Get config and flow from localStorage
    const config = JSON.parse(localStorage.getItem('currentAdConfig') || '{}');
    const flow = JSON.parse(localStorage.getItem('aige_current_flow') || 'null');
    if (!flow) {
      toast({
        title: "Generation Failed",
        description: "No flow data found. Please save your story flow before generating the script.",
        variant: "destructive"
      });
      return;
    }
    // Immediately navigate to generating screen
    navigate('/generating');
    // Start backend script generation in the background
    scriptAPI.generate(config, flow).catch((e) => {
      console.error("Script generation failed", e);
      toast({
        title: "Script Generation Failed",
        description: e?.response?.data?.error || e.message || "Unknown error",
        variant: "destructive"
      });
    });
  };

  // This function is for general step advancement if not coming from config form
  const handleGenericNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center space-x-4 mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep 
              ? 'bg-yellow-400 text-black' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {step}
          </div>
          {step < 5 && (
            <div className={`w-12 h-0.5 mx-2 ${
              step < currentStep ? 'bg-yellow-400' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        {/* Removed the icon above the heading */}
        <h2 className="text-3xl font-bold bg-yellow-400  bg-clip-text text-transparent">
          Get started with your immersive AR storytelling experience!
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Create interactive storytelling experiences with interactive elements that captivate your audience
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <Card 
            className="cursor-pointer group hover:shadow-2xl hover:shadow-yellow-400/20 transition-all duration-500 border border-gray-700 hover:border-yellow-400 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden relative"
            onClick={() => handleAdTypeSelect('immersive-story')}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-8 text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-10 h-10 text-black" />
              </div>
              <div className="flex items-center justify-center mb-4">
                <h3 className="text-2xl font-bold text-white">IMMERSIVE-STORY AIGE</h3>
                <Badge className="ml-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black border-0 px-3 py-1 font-semibold shadow-md">
                  Popular
                </Badge>
              </div>
              <p className="text-gray-300 text-base mb-6 leading-relaxed">
                Create interactive storytelling experiences with interactive elements that engage and delight your audience
              </p>
              <Button className="w-full bg-yellow-400 hover:bg-yellow-100 text-black font-bold text-lg py-4 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105 border-2 border-yellow-400">
                Start Creating <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => {
    if (selectedAdType === "immersive-story") {
      // Show template selection step
      return (
        <CreateAdEntry onSelect={handleTemplateSelect} />
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-black mb-2">Configure Your Ad</h2>
          <p className="text-gray-600">Set up the basic configuration for your {selectedAdType} experience</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This step will include form fields for theme prompts, tone/mood selection, 
              product image uploaders, and other configuration options.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderStep3 = () => {
    if (selectedAdType === "immersive-story") {
      // Optionally, you can use selectedTemplate to customize config/builder
      return (
        <StoryAdConfigForm 
          onBack={handleBack}
          onNext={handleConfigFormNext}
        />
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-black mb-2">Build Your Flow</h2>
          <p className="text-gray-600">Create the interactive flow for your {selectedAdType} experience</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Flow builder for other ad types will be available soon.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderStep4 = () => {
    if (selectedTemplate === 'choice-point') {
      return (
        <StoryFlowBuilderWrapper
          adConfigId={null}
          isStaticTemplate={true}
          useChoicePointTemplate={true}
          onBack={handleBack}
          onNext={handleGenericNext}
        />
      );
    }
    // Default: show normal builder or other logic
    return (
      <StoryFlowBuilderWrapper
        adConfigId={currentAdConfigId}
        isStaticTemplate={false}
        useChoicePointTemplate={false}
        onBack={handleBack}
        onNext={handleGenericNext}
      />
    );
  };

  return (
    <FlowProvider>
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-2">Create New AIGE Ad</h1>
            <p className="text-white">Build your AR-powered interactive ad experience</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="border-gray-300 hover:border-yellow-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>
    </FlowProvider>
  );
}
