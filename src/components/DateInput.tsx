import React, { useState } from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateInputProps {
  onDateSubmit: (date: string) => void;
  isLoading: boolean;
}

const DateInput: React.FC<DateInputProps> = ({ onDateSubmit, isLoading }) => {
  const [date, setDate] = useState<Date | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date) {
      // Format date as yyyy-mm-dd
      const formatted = date.toISOString().split('T')[0];
      onDateSubmit(formatted);
    }
  };

  const today = new Date();

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

        <div className="space-y-6 flex flex-col items-center">
          <div className="flex flex-col items-center w-full">
            <label htmlFor="dob" className="block text-sm font-medium text-indigo-200 mb-2 text-center">
              Date of Birth
            </label>
            <div className="w-full flex justify-center">
              <DatePicker
                id="dob"
                selected={date}
                onChange={(date) => setDate(date)}
                maxDate={today}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="yyyy-MM-dd"
                placeholderText="Select your birth date"
                className="w-full max-w-xs px-4 py-3 bg-white/5 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 text-center"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!date || isLoading}
            className="w-full max-w-xs py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 mt-4"
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