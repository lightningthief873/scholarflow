import React, { useState } from 'react';
import { Button } from '@radix-ui/themes';
import { useScholarFlow } from '../hooks/useScholarFlow';
import type { Grant } from '../types';

interface GrantApplicationFormProps {
  grant: Grant;
  onApplicationSubmitted: () => void;
  onCancel: () => void;
}

export function GrantApplicationForm({ grant, onApplicationSubmitted, onCancel }: GrantApplicationFormProps) {
  const { submitGrantApplication, loading, error } = useScholarFlow();
  const [applicationText, setApplicationText] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!applicationText.trim() || !requestedAmount) {
      alert('Please fill in all fields');
      return;
    }

    const amount = parseFloat(requestedAmount);
    if (amount <= 0 || amount > grant.max_grant_per_student) {
      alert(`Requested amount must be between $1 and $${grant.max_grant_per_student}`);
      return;
    }

    try {
      await submitGrantApplication(grant.id, applicationText.trim(), amount);
      onApplicationSubmitted();
    } catch (err) {
      console.error('Application submission failed:', err);
    }
  };

  const formatDeadline = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Apply for Grant</h2>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">{grant.title}</h3>
          <p className="text-gray-300 mb-3">{grant.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Max per student:</span>
              <span className="text-white ml-2">${grant.max_grant_per_student.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-400">Deadline:</span>
              <span className="text-white ml-2">{formatDeadline(grant.application_deadline)}</span>
            </div>
            <div>
              <span className="text-gray-400">Target demographic:</span>
              <span className="text-white ml-2 capitalize">{grant.target_demographic.replace('-', ' ')}</span>
            </div>
            <div>
              <span className="text-gray-400">Education level:</span>
              <span className="text-white ml-2 capitalize">{grant.target_education_level.replace('-', ' ')}</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Application Statement
          </label>
          <textarea
            value={applicationText}
            onChange={(e) => setApplicationText(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={8}
            placeholder="Please explain why you are applying for this grant, how it will help your education, and how you plan to use the funds..."
            required
          />
          <div className="text-sm text-gray-400 mt-1">
            {applicationText.length}/1000 characters
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Requested Amount ($)
          </label>
          <input
            type="number"
            value={requestedAmount}
            onChange={(e) => setRequestedAmount(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount"
            min="1"
            max={grant.max_grant_per_student}
            step="0.01"
            required
          />
          <div className="text-sm text-gray-400 mt-1">
            Maximum allowed: ${grant.max_grant_per_student.toLocaleString()}
          </div>
        </div>

        <div className="bg-yellow-900 border border-yellow-700 text-yellow-100 px-4 py-3 rounded">
          <h4 className="font-semibold mb-2">Important Notes:</h4>
          <ul className="text-sm space-y-1">
            <li>• Applications are reviewed by grant administrators</li>
            <li>• Funds can only be used for educational purchases from verified stores</li>
            <li>• False information may result in application rejection</li>
            <li>• You will be notified of the decision via the platform</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

