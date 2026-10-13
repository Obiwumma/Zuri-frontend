// AI Orchestrator client (calls backend orchestrator, never direct provider)
export async function executeAiTask(payload: Record<string, unknown>) {
  return { status: 'queued', taskId: 'stub-123', payload };
}
