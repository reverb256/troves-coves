import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Send, Sparkles, Bot, User, Gem } from 'lucide-react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface CrystalInfo {
  name: string;
  properties: string[];
  chakra: string;
  healing: string;
  care: string;
  description: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome to Troves and Coves! I\'m here to help you discover the perfect crystal jewelry for your intentions and needs. I can assist with crystal properties, product recommendations, shipping information, and consultation bookings. How can I help you today?',
      timestamp: new Date(),
      suggestions: [
        'Tell me about crystal properties',
        'Help me find jewelry for anxiety relief',
        'What\'s your shipping to Winnipeg?',
        'Schedule a crystal consultation'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [crystalInfo, setCrystalInfo] = useState<CrystalInfo | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const message = messageText || inputValue.trim();
    if (!message || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Check if user is asking about a specific crystal
      const crystalMatch = message.toLowerCase().match(/(?:about|properties of|tell me about)\s+(lepidolite|turquoise|citrine|lapis|rose quartz|amethyst)/i);
      
      if (crystalMatch) {
        const crystalName = crystalMatch[1];
        const response = await fetch(`/api/ai/crystal-info/${crystalName}`);
        const info = await response.json();
        
        if (!info.error) {
          setCrystalInfo(info);
        }
      }

      // Send message to AI assistant
      const response = await apiRequest('POST', '/api/ai-chat', {
        message,
        context: {
          previousMessages: messages.slice(-3),
          crystalInfo: crystalInfo
        }
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
      console.error('AI chat error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please feel free to contact us directly through our contact form or browse our crystal jewelry collection.',
        timestamp: new Date(),
        suggestions: [
          'Browse crystal necklaces',
          'Contact us directly',
          'View shipping information'
        ]
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Assistant Unavailable",
        description: "Our AI assistant is temporarily unavailable. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-14 h-14 bg-purple-600 hover:bg-purple-700 shadow-lg"
          size="lg"
        >
          {isOpen ? <MessageCircle className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] z-40 animate-in slide-in-from-bottom-2">
          <Card className="h-full flex flex-col shadow-2xl border-purple-200 bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gem className="h-5 w-5" />
                Crystal Guide Assistant
                <Badge variant="secondary" className="ml-auto text-xs bg-white/20">
                  AI Powered
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="space-y-2">
                      <div className={`flex items-start gap-3 ${
                        message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-purple-100 text-purple-600' 
                            : 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white'
                        }`}>
                          {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        
                        <div className={`flex-1 max-w-[80%] ${
                          message.type === 'user' ? 'text-right' : 'text-left'
                        }`}>
                          <div className={`rounded-lg px-4 py-2 text-sm ${
                            message.type === 'user'
                              ? 'bg-purple-600 text-white ml-auto'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {message.content}
                          </div>
                          
                          <div className="text-xs text-gray-500 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>

                      {/* Suggestions */}
                      {message.type === 'assistant' && message.suggestions && (
                        <div className="flex flex-wrap gap-2 ml-11">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 text-purple-600 border-purple-200 hover:bg-purple-50"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Crystal Info Panel */}
              {crystalInfo && (
                <>
                  <Separator />
                  <div className="p-4 bg-purple-50 max-h-32 overflow-y-auto">
                    <div className="text-sm">
                      <h4 className="font-semibold text-purple-800 mb-1">{crystalInfo.name}</h4>
                      <p className="text-purple-600 text-xs mb-2">{crystalInfo.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {crystalInfo.properties.slice(0, 3).map((prop, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                            {prop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Input Area */}
              <div className="p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about crystals, jewelry, or shipping..."
                    disabled={isLoading}
                    className="flex-1 border-purple-200 focus:border-purple-400"
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-purple-600 hover:bg-purple-700"
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500 mt-2 text-center">
                  Powered by AI • Crystal knowledge & Local Winnipeg expertise
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}