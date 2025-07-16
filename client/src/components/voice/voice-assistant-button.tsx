import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface VoiceAssistantButtonProps {
  language?: "english" | "hindi" | "tamil" | "telugu";
  onNavigate?: (path: string) => void;
}

export default function VoiceAssistantButton({ 
  language = "english", 
  onNavigate 
}: VoiceAssistantButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

  const languageSettings = {
    english: { locale: "en-IN", flag: "🇮🇳" },
    hindi: { locale: "hi-IN", flag: "🇮🇳" },
    tamil: { locale: "ta-IN", flag: "🇮🇳" },
    telugu: { locale: "te-IN", flag: "🇮🇳" }
  };

  useEffect(() => {
    // Check if Web Speech API is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = languageSettings[language].locale;
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceCommand(transcript);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Please try again or check your microphone permissions.",
          variant: "destructive"
        });
      };
      
      setRecognition(recognitionInstance);
    }
  }, [language]);

  const voiceCommandMutation = useMutation({
    mutationFn: async (transcript: string) => {
      const response = await apiRequest("POST", "/api/voice-assistant", {
        transcript,
        language,
        context: "healthcare_navigation"
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.intent) {
        // Speak the response
        speakResponse(data.response);
        
        // Navigate if needed
        if (data.intent.action === 'navigate' && onNavigate) {
          setTimeout(() => onNavigate(data.intent.target), 1000);
        } else if (data.intent.action === 'emergency') {
          handleEmergency();
        }
        
        toast({
          title: "Voice Command Recognized",
          description: data.response
        });
      } else {
        speakResponse(data.message);
        toast({
          title: "Command Not Recognized", 
          description: data.message,
          variant: "destructive"
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Voice Assistant Error",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  });

  const handleVoiceCommand = (transcript: string) => {
    voiceCommandMutation.mutate(transcript);
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languageSettings[language].locale;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleEmergency = () => {
    // In a real app, this would trigger emergency services
    const emergencyNumbers = {
      english: "Calling 108 Emergency Services",
      hindi: "108 आपातकालीन सेवा बुला रहे हैं",
      tamil: "108 அவசர சேவையை அழைக்கிறோம்",
      telugu: "108 అత్యవసర సేవలను పిలుస్తున్నాం"
    };
    
    speakResponse(emergencyNumbers[language]);
    toast({
      title: "Emergency Alert",
      description: "108 Emergency Services contacted",
      variant: "destructive"
    });
  };

  const startListening = () => {
    if (recognition && isSupported) {
      recognition.start();
    } else {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-center space-y-2">
        {isListening && (
          <Badge variant="secondary" className="animate-pulse">
            {languageSettings[language].flag} Listening...
          </Badge>
        )}
        
        <Button
          onClick={isListening ? stopListening : startListening}
          disabled={voiceCommandMutation.isPending}
          className={`
            w-16 h-16 rounded-full shadow-lg transition-all duration-300
            ${isListening 
              ? 'bg-red-500 hover:bg-red-600 scale-110' 
              : 'bg-blue-500 hover:bg-blue-600'
            }
          `}
        >
          {isListening ? (
            <MicOff className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </Button>
        
        <Badge variant="outline" className="text-xs">
          {languageSettings[language].flag} Voice
        </Badge>
      </div>
    </div>
  );
}