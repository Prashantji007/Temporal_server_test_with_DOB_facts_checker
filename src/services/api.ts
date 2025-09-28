const API_BASE_URL = 'http://4.187.227.149';

export interface StartAnalysisResponse {
  workflow_id: string;
}

export const analyzeDOB = async (dob: string): Promise<StartAnalysisResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dob }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to start analysis');
  }

  return response.json();
};

export const pollWorkflowStatus = async (workflowId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/workflow/${workflowId}`);

  if (!response.ok) {
    throw new Error('Failed to get workflow status');
  }

  return response.json();
};
