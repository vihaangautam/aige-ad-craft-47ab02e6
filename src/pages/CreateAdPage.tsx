
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Camera, Gamepad2, Image, ArrowRight, ArrowLeft } from "lucide-react";

interface CreateAdPageProps {
  onNavigate: (path: string) => void;
}

const adTypes = [
  {
    id: "immersive-story",
    title: "Immersive Story AR",
    description: "Create interactive storytelling experiences with AR elements",
    icon: Sparkles,
    popular: true
  },
  {
    id: "virtual-try-on",
    title: "Virtual Try-On",
    description: "Let customers try products virtually using AR technology",
    icon: Camera,
    popular: true
  },
  {
    id: "game-ar",
    title: "Game AR",
    description: "Engage users with interactive AR games and challenges",
    icon: Gamepad2,
    popular: false
  },
  {
    id: "poster-ar",
    title: "Poster AR",
    description: "Transform static posters into interactive AR experiences",
    icon: Image,
    popular: false
  }
];

export function CreateAdPage({ onNavigate }: CreateAdPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAdType, setSelectedAdType] = useState<string | null>(null);

  const handleAdTypeSelect = (typeId: string) => {
    setSelectedAdType(typeId);
    setCurrentStep(2);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onNavigate("/");
    }
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-black mb-2">Choose Your Ad Type</h2>
        <p className="text-gray-600">Select the type of AR experience you want to create</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adTypes.map((type) => (
          <Card 
            key={type.id}
            className="cursor-pointer hover:shadow-lg hover:shadow-yellow-400/10 transition-all duration-300 border border-gray-200 hover:border-yellow-400"
            onClick={() => handleAdTypeSelect(type.id)}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <type.icon className="w-8 h-8 text-black" />
              </div>
              
              <div className="flex items-center justify-center mb-2">
                <h3 className="text-lg font-semibold text-black">{type.title}</h3>
                {type.popular && (
                  <Badge className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">
                    Popular
                  </Badge>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{type.description}</p>
              
              <Button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold">
                Start <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Create New AIGE Ad</h1>
          <p className="text-gray-600">Build your AR-powered interactive ad experience</p>
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
    </div>
  );
}
