import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bot, User, Send, Brain, MessageCircle, Shield } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm here to help you find the perfect jewelry piece. What occasion are you shopping for?",
      timestamp: new Date(),
      suggestions: [
        "Engagement ring",
        "Anniversary gift",
        "Special occasion",
        "Everyday jewelry"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/ai-chat", {
        message: messageToSend,
        context: messages.slice(-5) // Send last 5 messages for context
      });

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const features = [
    {
      icon: Brain,
      title: "Smart Recommendations",
      description: "AI-powered suggestions based on your style preferences and budget"
    },
    {
      icon: MessageCircle,
      title: "Expert Consultation",
      description: "Real-time advice on stones, settings, and customization options"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security with local processing capabilities"
    }
  ];

  return (
    <section className="py-20 bg-navy text-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Introduction */}
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Meet Your <span className="text-elegant-gold">AI Jewelry Concierge</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Experience personalized jewelry consultation powered by advanced AI. Our intelligent 
              assistant helps you find the perfect piece, provides expert advice, and ensures your 
              journey to luxury is seamless.
            </p>
            
            <div className="space-y-6 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <Icon className="text-elegant-gold text-xl mt-1 w-6 h-6 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Chat Interface */}
          <Card className="bg-rich-blue border-gray-600 luxury-shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-white">
                <div className="w-10 h-10 bg-elegant-gold rounded-full flex items-center justify-center">
                  <Bot className="text-navy w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">Jewelry Assistant</div>
                  <div className="text-sm text-gray-300 font-normal">Powered by Advanced AI</div>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Chat Messages */}
              <ScrollArea className="h-80 w-full">
                <div className="space-y-4 pr-4">
                  {messages.map((message) => (
                    <div key={message.id} className="space-y-2">
                      <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start space-x-2 max-w-[80%] ${
                          message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.type === 'user' 
                              ? 'bg-elegant-gold text-navy' 
                              : 'bg-white/10 text-elegant-gold'
                          }`}>
                            {message.type === 'user' ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </div>
                          
                          <div className={`p-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-elegant-gold/20 text-white'
                              : 'bg-white/5 text-gray-100'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      </div>

                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 ml-10">
                          {message.suggestions.map((suggestion, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs bg-white/5 border-white/20 text-gray-300 hover:bg-elegant-gold hover:text-navy hover:border-elegant-gold"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-elegant-gold">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <Separator className="bg-white/20" />

              {/* Input */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex space-x-2"
              >
                <Input
                  type="text"
                  placeholder="Ask about diamonds, settings, or styling..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-elegant-gold"
                />
                <Button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-elegant-gold text-navy hover:bg-yellow-400 font-semibold"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
