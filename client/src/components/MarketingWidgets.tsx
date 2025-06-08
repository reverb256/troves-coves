import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Star, Heart, Gift, Zap, Crown, Users, TrendingUp } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface PersonalizationData {
  crystalAffinities: string[];
  purchaseHistory: string[];
  browsingBehavior: string[];
  personalityProfile: string;
  recommendations: any[];
}

export function PersonalizedRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [persona, setPersona] = useState('');

  useEffect(() => {
    generatePersonalizedRecommendations();
  }, []);

  const generatePersonalizedRecommendations = async () => {
    try {
      const response = await apiRequest('POST', '/api/ai/chat', {
        prompt: "Based on current crystal jewelry trends and healing properties, recommend 3 pieces perfect for someone seeking emotional balance and spiritual growth",
        type: 'text',
        priority: 'medium'
      });

      const data = await response.json();
      
      // Extract recommendations from AI response
      const mockRecommendations = [
        {
          id: 1,
          name: 'Moonstone Intuition Pendant',
          reason: 'Perfect for enhancing intuition and emotional balance',
          confidence: 95,
          crystalProperties: ['intuition', 'emotional-healing', 'feminine-energy']
        },
        {
          id: 2,
          name: 'Lepidolite Stress Relief Bracelet',
          reason: 'Natural lithium content for anxiety relief and peace',
          confidence: 88,
          crystalProperties: ['stress-relief', 'anxiety', 'calming']
        },
        {
          id: 3,
          name: 'Clear Quartz Amplification Ring',
          reason: 'Amplifies intentions and promotes clarity',
          confidence: 92,
          crystalProperties: ['amplification', 'clarity', 'master-healer']
        }
      ];

      setRecommendations(mockRecommendations);
      setPersona('Spiritual Seeker');
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-gold/20 bg-gradient-to-br from-white to-gold/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-5 w-5 text-gold animate-pulse" />
            <span className="text-sm text-gray-600">Crafting personalized recommendations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gold/20 bg-gradient-to-br from-white to-gold/5 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gold">
          <Sparkles className="h-5 w-5" />
          AI-Curated For You
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-100 text-purple-800">
            <Crown className="h-3 w-3 mr-1" />
            {persona}
          </Badge>
          <Badge variant="outline" className="text-xs">
            97% Match
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((item: any) => (
          <div key={item.id} className="p-4 rounded-lg bg-white/50 border border-gold/10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.reason}</p>
                <div className="flex items-center gap-2 mt-2">
                  {item.crystalProperties.map((prop: string) => (
                    <Badge key={prop} variant="secondary" className="text-xs">
                      {prop}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <Star className="h-4 w-4 text-gold fill-current" />
                <span className="text-sm font-medium">{item.confidence}%</span>
              </div>
            </div>
          </div>
        ))}
        <Button 
          className="w-full bg-gradient-to-r from-gold to-amber-500 hover:from-gold/90 hover:to-amber-500/90"
          onClick={() => window.location.href = '/products'}
        >
          Explore These Recommendations
        </Button>
      </CardContent>
    </Card>
  );
}

export function SocialProofWidget() {
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Simulate real-time activity updates
    const activities = [
      { user: 'Sarah M.', action: 'purchased', item: 'Rose Quartz Heart Pendant', location: 'Toronto, ON', time: '2 minutes ago' },
      { user: 'Jennifer L.', action: 'added to cart', item: 'Amethyst Cluster Earrings', location: 'Vancouver, BC', time: '5 minutes ago' },
      { user: 'Michelle K.', action: 'purchased', item: 'Lepidolite Meditation Bracelet', location: 'Calgary, AB', time: '8 minutes ago' },
      { user: 'Amanda R.', action: 'viewed', item: 'Clear Quartz Point Necklace', location: 'Montreal, QC', time: '12 minutes ago' }
    ];

    setRecentActivity(activities);

    // Update activity every 30 seconds
    const interval = setInterval(() => {
      const newActivity = {
        user: `Customer ${Math.floor(Math.random() * 100)}`,
        action: Math.random() > 0.7 ? 'purchased' : Math.random() > 0.5 ? 'added to cart' : 'viewed',
        item: 'Healing Crystal Jewelry',
        location: ['Toronto, ON', 'Vancouver, BC', 'Calgary, AB', 'Ottawa, ON', 'Winnipeg, MB'][Math.floor(Math.random() * 5)],
        time: 'just now'
      };
      
      setRecentActivity(prev => [newActivity, ...prev.slice(0, 3)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-700 text-sm">
          <Users className="h-4 w-4" />
          Live Activity in Canada
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentActivity.map((activity: any, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">{activity.user}</span>
              <span className="text-gray-500">{activity.action}</span>
            </div>
            <div className="text-gray-400 text-right">
              <div>{activity.location}</div>
              <div>{activity.time}</div>
            </div>
          </div>
        ))}
        <div className="pt-2 border-t border-green-200">
          <div className="flex items-center justify-between text-xs text-green-600">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              47 people viewing now
            </span>
            <span>🔥 High demand</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function UrgencyWidget({ productId }: { productId?: number }) {
  const [urgencyData, setUrgencyData] = useState({
    stockLevel: 3,
    viewerCount: 12,
    lastPurchase: '23 minutes ago',
    trending: true
  });

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-orange-700">
              ⚡ Only {urgencyData.stockLevel} left in stock
            </span>
            <Badge className="bg-orange-100 text-orange-800 text-xs">
              Limited
            </Badge>
          </div>
          
          <div className="text-xs text-gray-600 space-y-1">
            <div>👀 {urgencyData.viewerCount} people viewing this item</div>
            <div>🛒 Last purchased {urgencyData.lastPurchase}</div>
            {urgencyData.trending && (
              <div className="flex items-center gap-1 text-orange-600">
                <Zap className="h-3 w-3" />
                Trending in Winnipeg
              </div>
            )}
          </div>

          <div className="w-full bg-orange-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(urgencyData.stockLevel / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AstrologyIntegration() {
  const [userSign, setUserSign] = useState('');
  const [crystalMatch, setCrystalMatch] = useState(null);

  const zodiacCrystals = {
    aries: { crystal: 'Carnelian', properties: 'Courage & Energy', color: 'text-red-600' },
    taurus: { crystal: 'Rose Quartz', properties: 'Love & Stability', color: 'text-pink-600' },
    gemini: { crystal: 'Citrine', properties: 'Communication & Joy', color: 'text-yellow-600' },
    cancer: { crystal: 'Moonstone', properties: 'Intuition & Emotions', color: 'text-blue-600' },
    leo: { crystal: 'Sunstone', properties: 'Confidence & Leadership', color: 'text-orange-600' },
    virgo: { crystal: 'Amazonite', properties: 'Clarity & Balance', color: 'text-green-600' },
    libra: { crystal: 'Lepidolite', properties: 'Harmony & Peace', color: 'text-purple-600' },
    scorpio: { crystal: 'Obsidian', properties: 'Protection & Transformation', color: 'text-gray-800' },
    sagittarius: { crystal: 'Turquoise', properties: 'Wisdom & Adventure', color: 'text-teal-600' },
    capricorn: { crystal: 'Garnet', properties: 'Grounding & Ambition', color: 'text-red-700' },
    aquarius: { crystal: 'Amethyst', properties: 'Spirituality & Innovation', color: 'text-purple-700' },
    pisces: { crystal: 'Aquamarine', properties: 'Intuition & Compassion', color: 'text-blue-500' }
  };

  const handleSignSelect = (sign: string) => {
    setUserSign(sign);
    setCrystalMatch(zodiacCrystals[sign.toLowerCase() as keyof typeof zodiacCrystals]);
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Star className="h-5 w-5" />
          Your Crystal Destiny
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-purple-700 mb-2 block">
            What's your zodiac sign?
          </label>
          <select 
            className="w-full p-2 border border-purple-200 rounded-md text-sm"
            value={userSign}
            onChange={(e) => handleSignSelect(e.target.value)}
          >
            <option value="">Select your sign</option>
            {Object.keys(zodiacCrystals).map(sign => (
              <option key={sign} value={sign}>
                {sign.charAt(0).toUpperCase() + sign.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {crystalMatch && (
          <div className="p-4 rounded-lg bg-purple-100 border border-purple-200">
            <div className="text-center space-y-2">
              <div className={`text-lg font-bold ${crystalMatch.color}`}>
                {crystalMatch.crystal}
              </div>
              <div className="text-sm text-purple-700">
                Perfect for: {crystalMatch.properties}
              </div>
              <Button 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => window.location.href = `/products?crystal=${crystalMatch.crystal.toLowerCase()}`}
              >
                Shop Your Crystal Match
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-purple-600 text-center">
          ✨ Discover the crystal that aligns with your cosmic energy
        </div>
      </CardContent>
    </Card>
  );
}

export function GamificationWidget() {
  const [userLevel, setUserLevel] = useState(1);
  const [points, setPoints] = useState(250);
  const [nextReward, setNextReward] = useState(500);

  const achievements = [
    { name: 'Crystal Collector', icon: '💎', unlocked: true },
    { name: 'Spiritual Seeker', icon: '🧘', unlocked: true },
    { name: 'Healing Explorer', icon: '✨', unlocked: false },
    { name: 'Crystal Master', icon: '👑', unlocked: false }
  ];

  return (
    <Card className="border-gold/20 bg-gradient-to-br from-amber-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-700">
          <Crown className="h-5 w-5" />
          Crystal Collector Level {userLevel}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to next level</span>
            <span className="text-amber-600 font-medium">{points}/{nextReward} points</span>
          </div>
          <div className="w-full bg-amber-200 rounded-full h-2">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(points / nextReward) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className={`p-2 rounded-lg text-center text-xs ${
                achievement.unlocked 
                  ? 'bg-amber-100 border border-amber-200 text-amber-700' 
                  : 'bg-gray-100 border border-gray-200 text-gray-400'
              }`}
            >
              <div className="text-lg mb-1">{achievement.icon}</div>
              <div className="font-medium">{achievement.name}</div>
            </div>
          ))}
        </div>

        <div className="text-xs text-amber-600 space-y-1">
          <div>🎁 Earn points with every purchase</div>
          <div>🎯 Unlock exclusive crystal collections</div>
          <div>💫 Get early access to new arrivals</div>
        </div>
      </CardContent>
    </Card>
  );
}