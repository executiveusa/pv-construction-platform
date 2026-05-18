// Tool definition for orchestration system (Hermes agent integration)
// Simplified implementation without 'ai' package dependency
import orchestrator from './orchestrator';
import workerRunner from './workerRunner';

export interface OrchestratorToolParams {
  action: 'createJob' | 'getStatus' | 'getWorkers' | 'executeTask' | 'cancelJob';
  jobType?: 'build' | 'deploy' | 'test' | 'lint' | 'typecheck' | 'ralphy' | 'jcodemunch' | 'uncodixfy';
  payload?: Record<string, any>;
  priority?: number;
  jobId?: string;
  worker?: 'ralphy' | 'jcodemunch' | 'uncodixfy' | 'typescript' | 'build';
}

export const orchestratorTool = {
  name: 'orchestrator',
  description: 'Execute build and development tasks using the orchestration system',
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['createJob', 'getStatus', 'getWorkers', 'executeTask', 'cancelJob'],
        description: 'The action to perform',
      },
      jobType: {
        type: 'string',
        enum: ['build', 'deploy', 'test', 'lint', 'typecheck', 'ralphy', 'jcodemunch', 'uncodixfy'],
        description: 'Type of job to create (required for createJob action)',
      },
      payload: {
        type: 'object',
        description: 'Payload for the job/task (required for createJob and executeTask actions)',
      },
      priority: {
        type: 'number',
        minimum: 1,
        maximum: 10,
        default: 1,
        description: 'Job priority (1=highest, 10=lowest)',
      },
      jobId: {
        type: 'string',
        description: 'Job ID to get status or cancel (required for getStatus and cancelJob actions)',
      },
      worker: {
        type: 'string',
        enum: ['ralphy', 'jcodemunch', 'uncodixfy', 'typescript', 'build'],
        description: 'Specific worker to use (optional for executeTask action)',
      },
    },
    required: ['action'],
  },
  execute: async (args: OrchestratorToolParams) => {
    try {
      switch (args.action) {
        case 'createJob':
          if (!args.jobType) {
            throw new Error('jobType is required for createJob action');
          }
          if (!args.payload) {
            throw new Error('payload is required for createJob action');
          }

          const jobId = await orchestrator.createJob(
            args.jobType as any,
            args.payload,
            args.priority || 1
          );

          return {
            success: true,
            jobId,
            message: `Job created successfully with ID: ${jobId}`,
            type: args.jobType,
            priority: args.priority || 1,
          };

        case 'getStatus':
          if (!args.jobId) {
            throw new Error('jobId is required for getStatus action');
          }

          const job = await orchestrator.getJobStatus(args.jobId);
          if (!job) {
            return {
              success: false,
              message: `Job not found: ${args.jobId}`,
            };
          }

          return {
            success: true,
            job,
          };

        case 'getWorkers':
          const workers = await orchestrator.getWorkerStatus();
          const queue = await orchestrator.getQueueStatus();
          
          return {
            success: true,
            workers,
            queue,
            summary: {
              totalWorkers: workers.length,
              activeWorkers: workers.filter(w => w.status === 'busy').length,
              idleWorkers: workers.filter(w => w.status === 'idle').length,
              pendingJobs: queue.pending,
              runningJobs: queue.running,
            },
          };

        case 'executeTask':
          if (!args.payload) {
            throw new Error('payload is required for executeTask action');
          }

          let result;
          if (args.worker) {
            switch (args.worker) {
              case 'ralphy':
                result = await workerRunner.executeRalphyTask(
                  args.payload.command,
                  args.payload.cwd
                );
                break;
              case 'jcodemunch':
                result = await workerRunner.executeJcodemunch(
                  args.payload.input,
                  args.payload.output,
                  args.payload.cwd
                );
                break;
              case 'uncodixfy':
                result = await workerRunner.executeUncodixfy(
                  args.payload.input,
                  args.payload.output,
                  args.payload.cwd
                );
                break;
              case 'typescript':
                result = await workerRunner.executeTypecheck(args.payload.cwd);
                break;
              case 'build':
                result = await workerRunner.executeBuild(args.payload.cwd);
                break;
              default:
                throw new Error(`Unknown worker type: ${args.worker}`);
            }
          } else {
            // Use orchestrator for general job execution
            const jobId = await orchestrator.createJob(
              args.jobType as any,
              args.payload,
              args.priority || 1
            );
            result = { jobId, message: 'Job queued for execution' };
          }

          return {
            success: true,
            worker: args.worker,
            result,
          };

        case 'cancelJob':
          if (!args.jobId) {
            throw new Error('jobId is required for cancelJob action');
          }

          const cancelled = workerRunner.cancelJob(args.jobId);
          if (cancelled) {
            return {
              success: true,
              jobId: args.jobId,
              message: 'Job cancelled successfully',
            };
          } else {
            return {
              success: false,
              jobId: args.jobId,
              message: 'Job not found or not active',
            };
          }

        default:
          throw new Error(`Unknown action: ${args.action}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
};

// Helper functions for common tasks
export const orchestratorHelpers = {
  // Quick build task
  async buildProject(cwd?: string) {
    return orchestratorTool.execute({
      action: 'executeTask',
      jobType: 'build',
      payload: { cwd },
      worker: 'build',
    });
  },

  // Type check task
  async typecheckProject(cwd?: string) {
    return orchestratorTool.execute({
      action: 'executeTask',
      jobType: 'typecheck',
      payload: { cwd },
      worker: 'typescript',
    });
  },

  // Lint task
  async lintProject(cwd?: string) {
    return orchestratorTool.execute({
      action: 'executeTask',
      jobType: 'lint',
      payload: { cwd },
      worker: 'typescript',
    });
  },

  // Ralphy task
  async runRalphy(command: string, cwd?: string) {
    return orchestratorTool.execute({
      action: 'executeTask',
      jobType: 'ralphy',
      payload: { command, cwd },
      worker: 'ralphy',
    });
  },

  // jcodemunch task
  async compressPrompt(input: string, output?: string, cwd?: string) {
    return orchestratorTool.execute({
      action: 'executeTask',
      jobType: 'jcodemunch',
      payload: { input, output, cwd },
      worker: 'jcodemunch',
    });
  },

  // Uncodixfy task
  async optimizeCode(input: string, output?: string, cwd?: string) {
    return orchestratorTool.execute({
      action: 'executeTask',
      jobType: 'uncodixfy',
      payload: { input, output, cwd },
      worker: 'uncodixfy',
    });
  },

  // Get system status
  async getSystemStatus() {
    return orchestratorTool.execute({
      action: 'getWorkers',
    });
  },

  // Monitor job progress
  async monitorJob(jobId: string) {
    return orchestratorTool.execute({
      action: 'getStatus',
      jobId,
    });
  },
};