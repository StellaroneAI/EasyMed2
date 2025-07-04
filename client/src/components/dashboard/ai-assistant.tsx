import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Lightbulb } from "lucide-react";

export default function AiAssistant() {
  return (
    <Card className="bg-gradient-to-br from-digital-purple to-purple-600 text-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>

        <p className="text-purple-100 text-sm mb-4">
          Get AI-powered insights for symptom analysis and preliminary diagnosis assistance.
        </p>

        <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-yellow-300 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Recent Insight</p>
              <p className="text-xs text-purple-100 mt-1">
                Based on recent symptoms, consider cardiovascular screening for 3 patients.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => console.log("Open AI Checker")}
          className="w-full bg-white text-digital-purple font-medium py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors"
        >
          Open AI Symptom Checker
        </Button>
      </CardContent>
    </Card>
  );
}
