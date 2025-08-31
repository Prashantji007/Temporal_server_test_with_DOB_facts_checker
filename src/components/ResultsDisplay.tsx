import React from 'react';
import { 
  User, 
  Calendar, 
  Star, 
  Heart, 
  Clock, 
  Sparkles,
  TrendingUp,
  Moon,
  Sun
} from 'lucide-react';
import type { AnalysisResults } from '../types';

interface ResultsDisplayProps {
  results: AnalysisResults;
  selectedDate: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, selectedDate }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Birth Date Analysis Complete
        </h2>
        <p className="text-indigo-200 text-lg">
          {formatDate(selectedDate)}
        </p>
      </div>

      {/* Age Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center gap-3 mb-3">
            <User className="w-6 h-6 text-blue-300" />
            <h3 className="font-semibold text-white">Age</h3>
          </div>
          <p className="text-2xl font-bold text-blue-100">{results.age.years} years</p>
          <p className="text-sm text-blue-200 mt-1">{formatNumber(results.age.days)} days old</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-6 h-6 text-purple-300" />
            <h3 className="font-semibold text-white">Time Lived</h3>
          </div>
          <p className="text-2xl font-bold text-purple-100">{formatNumber(results.age.hours)} hours</p>
          <p className="text-sm text-purple-200 mt-1">{formatNumber(results.age.minutes)} minutes</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-teal-600/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-6 h-6 text-green-300" />
            <h3 className="font-semibold text-white">Next Birthday</h3>
          </div>
          <p className="text-2xl font-bold text-green-100">{results.fun_facts.days_to_next_birthday} days</p>
          <p className="text-sm text-green-200 mt-1">Until celebration</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30">
          <div className="flex items-center gap-3 mb-3">
            <Sun className="w-6 h-6 text-yellow-300" />
            <h3 className="font-semibold text-white">Born On</h3>
          </div>
          <p className="text-2xl font-bold text-yellow-100">{results.day_info.day_of_week}</p>
          <p className="text-sm text-yellow-200 mt-1">Day of the week</p>
        </div>
      </div>

      {/* Zodiac Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-yellow-300" />
            <h3 className="text-xl font-bold text-white">Western Zodiac</h3>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-100 mb-2">
              {results.zodiac.western}
            </p>
            <p className="text-indigo-200">Your celestial sign</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Moon className="w-6 h-6 text-red-300" />
            <h3 className="text-xl font-bold text-white">Chinese Zodiac</h3>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-100 mb-2">
              {results.zodiac.chinese}
            </p>
            <p className="text-indigo-200">Your lunar year animal</p>
          </div>
        </div>
      </div>

      {/* Fun Facts */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-purple-300" />
          <h3 className="text-xl font-bold text-white">Fascinating Facts</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-red-300" />
              <h4 className="font-semibold text-white">Heartbeats</h4>
            </div>
            <p className="text-2xl font-bold text-red-100">
              {formatNumber(results.fun_facts.estimated_heartbeats)}
            </p>
            <p className="text-xs text-gray-300 mt-1">Estimated total</p>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-300" />
              <h4 className="font-semibold text-white">Life Path</h4>
            </div>
            <p className="text-2xl font-bold text-green-100">
              Number {results.numerology.life_path}
            </p>
            <p className="text-xs text-gray-300 mt-1">Numerology</p>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-5 h-5 text-blue-300" />
              <h4 className="font-semibold text-white">Lunar Cycles</h4>
            </div>
            <p className="text-2xl font-bold text-blue-100">
              {Math.floor(results.fun_facts.lunar_cycles_lived)}
            </p>
            <p className="text-xs text-gray-300 mt-1">Experienced</p>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-5 h-5 text-yellow-300" />
              <h4 className="font-semibold text-white">Seasons</h4>
            </div>
            <p className="text-2xl font-bold text-yellow-100">
              {results.fun_facts.seasons_experienced}
            </p>
            <p className="text-xs text-gray-300 mt-1">Changes witnessed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;