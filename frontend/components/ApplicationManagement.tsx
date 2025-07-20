import { useState } from 'react';
import { Button } from '@radix-ui/themes';
import { useScholarFlow } from '../hooks/useScholarFlow';
import type { GrantApplication, Grant } from '../types';

interface ApplicationManagementProps {
  applications: GrantApplication[];
  grants: Grant[];
}

export function ApplicationManagement({ applications, grants }: ApplicationManagementProps) {
  const { approveApplication, loading } = useScholarFlow();
  const [selectedApplication, setSelectedApplication] = useState<GrantApplication | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const getGrantTitle = (grantId: string) => {
    const grant = grants.find(g => g.id === grantId);
    return grant?.title || 'Unknown Grant';
  };

  const handleApprove = async (applicationId: string) => {
    setProcessingId(applicationId);
    try {
      await approveApplication(applicationId);
    } catch (err) {
      console.error('Failed to approve application:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (applicationId: string) => {
    // In a real implementation, this would call a reject function
    console.log('Rejecting application:', applicationId);
    // For now, just show an alert
    alert('Reject functionality would be implemented here');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'approved': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const processedApplications = applications.filter(app => app.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Application Management</h2>
        
        {/* Pending Applications */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Pending Applications ({pendingApplications.length})
          </h3>
          
          {pendingApplications.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              No pending applications to review
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApplications.map(application => (
                <div key={application.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-white">
                        {getGrantTitle(application.grant_id)}
                      </h4>
                      <p className="text-sm text-gray-400">
                        Applied: {formatDate(application.application_timestamp)}
                      </p>
                      <p className="text-sm text-gray-400">
                        Student: {application.student_address.slice(0, 8)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-white">
                        {formatAmount(application.requested_amount)}
                      </div>
                      <div className={`text-sm font-medium ${getStatusColor(application.status)}`}>
                        {application.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {application.application_text}
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApprove(application.id)}
                      disabled={loading || processingId === application.id}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      {processingId === application.id ? 'Approving...' : 'Approve'}
                    </Button>
                    <Button
                      onClick={() => handleReject(application.id)}
                      disabled={loading || processingId === application.id}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => setSelectedApplication(application)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Processed Applications */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Processed Applications ({processedApplications.length})
          </h3>
          
          {processedApplications.length === 0 ? (
            <div className="text-gray-400 text-center py-4">
              No processed applications yet
            </div>
          ) : (
            <div className="space-y-3">
              {processedApplications.map(application => (
                <div key={application.id} className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-white">
                        {getGrantTitle(application.grant_id)}
                      </h4>
                      <p className="text-sm text-gray-400">
                        Student: {application.student_address.slice(0, 8)}... | 
                        Applied: {formatDate(application.application_timestamp)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">
                        {formatAmount(application.requested_amount)}
                      </div>
                      <div className={`text-sm font-medium ${getStatusColor(application.status)}`}>
                        {application.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">Application Details</h3>
              <Button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Grant</label>
                <p className="text-white">{getGrantTitle(selectedApplication.grant_id)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Student Address</label>
                <p className="text-white font-mono">{selectedApplication.student_address}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Requested Amount</label>
                <p className="text-white">{formatAmount(selectedApplication.requested_amount)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Application Date</label>
                <p className="text-white">{formatDate(selectedApplication.application_timestamp)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <p className={`font-medium ${getStatusColor(selectedApplication.status)}`}>
                  {selectedApplication.status.toUpperCase()}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Application Statement</label>
                <div className="bg-gray-700 p-3 rounded border border-gray-600">
                  <p className="text-white leading-relaxed">{selectedApplication.application_text}</p>
                </div>
              </div>
            </div>
            
            {selectedApplication.status === 'pending' && (
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => {
                    handleApprove(selectedApplication.id);
                    setSelectedApplication(null);
                  }}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => {
                    handleReject(selectedApplication.id);
                    setSelectedApplication(null);
                  }}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

