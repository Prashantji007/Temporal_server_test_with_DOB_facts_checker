import React, { useState } from 'react';
import { Calendar, Sparkles } from 'lucide-react';

interface DateInputProps {
  onDateSubmit: (date: string) => void;
  isLoading: boolean;
}

const DateInput: React.FC<DateInputProps> = ({ onDateSubmit, isLoading }) => {
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date) {
      onDateSubmit(date);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Enter Your Birth Date</h2>
          <p className="text-indigo-200">Let's uncover the mysteries hidden in your special day</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="dob" className="block text-sm font-medium text-indigo-200 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={today}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={!date || isLoading}
            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Starting Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Analyze Birth Date</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DateInput;