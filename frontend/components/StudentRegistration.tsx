import React, { useState } from 'react';
import { Button } from '@radix-ui/themes';
import { DEMOGRAPHICS, EDUCATION_LEVELS } from '../constants';
import { useScholarFlow } from '../hooks/useScholarFlow';

interface StudentRegistrationProps {
  onRegistrationComplete: () => void;
}

export function StudentRegistration({ onRegistrationComplete }: StudentRegistrationProps) {
  const { registerStudent, loading, error } = useScholarFlow();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    demographic: '',
    education_level: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.demographic || !formData.education_level) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await registerStudent(
        formData.name,
        parseInt(formData.age),
        formData.demographic,
        formData.education_level
      );
      onRegistrationComplete();
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Student Registration</h2>
      
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Age
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your age"
            min="16"
            max="100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Demographic
          </label>
          <select
            value={formData.demographic}
            onChange={(e) => handleInputChange('demographic', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select demographic</option>
            {DEMOGRAPHICS.map(demo => (
              <option key={demo} value={demo}>
                {demo.charAt(0).toUpperCase() + demo.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Education Level
          </label>
          <select
            value={formData.education_level}
            onChange={(e) => handleInputChange('education_level', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select education level</option>
            {EDUCATION_LEVELS.map(level => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {loading ? 'Registering...' : 'Register as Student'}
        </Button>
      </form>

      <div className="mt-4 text-sm text-gray-400">
        <p>By registering, you agree to provide accurate information for grant eligibility verification.</p>
      </div>
    </div>
  );
}

