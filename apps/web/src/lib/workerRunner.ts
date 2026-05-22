import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

export interface WorkerConfig {
  type: 'ralphy' | 'jcodemunch' | 'uncodixfy' | 'typescript' | 'build';
  command: string;
  args?: string[];
  cwd?: string;
  timeout?: number;
  env?: NodeJS.ProcessEnv;
}

export interface WorkerResult {
  success: boolean;
  output: string;
  error?: string;
  duration: number;
  timestamp: Date;
}

export class WorkerRunner {
  private static instance: WorkerRunner;
  private activeJobs: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): WorkerRunner {
    if (!WorkerRunner.instance) {
      WorkerRunner.instance = new WorkerRunner();
    }
    return WorkerRunner.instance;
  }

  async executeWorker(config: WorkerConfig): Promise<WorkerResult> {
    const jobId = `worker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    try {
      // Validate configuration
      if (!this.validateConfig(config)) {
        throw new Error(`Invalid worker configuration: ${JSON.stringify(config)}`);
      }

      // Prepare environment
      const env = {
        ...process.env,
        ...config.env,
        WORKER_ID: jobId,
        WORKER_TYPE: config.type,
      };

      // Build command
      const command = await this.getCommandPath(config.type);
      const args = this.buildArgs(config);

      // Execute with timeout
      const timeout = config.timeout || 300000; // 5 minutes default
      const timeoutPromise = new Promise<never>((_, reject) => {
        const timeoutId = setTimeout(() => {
          this.activeJobs.delete(jobId);
          reject(new Error(`Worker timeout after ${timeout}ms`));
        }, timeout);
        this.activeJobs.set(jobId, timeoutId);
      });

      // Execute worker
      const executePromise = this.executeCommand(command, args, config.cwd || process.cwd(), env);
      
      const result = await Promise.race([executePromise, timeoutPromise]);
      
      // Clean up
      if (this.activeJobs.has(jobId)) {
        clearTimeout(this.activeJobs.get(jobId)!);
        this.activeJobs.delete(jobId);
      }

      const duration = Date.now() - startTime;
      
      return {
        success: result.success,
        output: result.output,
        error: result.error,
        duration,
        timestamp: new Date(),
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Clean up on error
      if (this.activeJobs.has(jobId)) {
        clearTimeout(this.activeJobs.get(jobId)!);
        this.activeJobs.delete(jobId);
      }

      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        timestamp: new Date(),
      };
    }
  }

  private validateConfig(config: WorkerConfig): boolean {
    if (!config.type || !['ralphy', 'jcodemunch', 'uncodixfy', 'typescript', 'build'].includes(config.type)) {
      return false;
    }
    
    if (!config.command) {
      return false;
    }
    
    return true;
  }

  private async getCommandPath(type: string): Promise<string> {
    const basePath = process.cwd();
    
    switch (type) {
      case 'ralphy':
        return path.join(basePath, 'ralphy', 'cli', 'bin.js');
      case 'jcodemunch':
        return path.join(basePath, 'jcodemunch-mcp', 'index.js');
      case 'uncodixfy':
        return path.join(basePath, 'pauli-Uncodixfy', 'index.js');
      case 'typescript':
        return 'npx';
      case 'build':
        return 'npm';
      default:
        throw new Error(`Unknown worker type: ${type}`);
    }
  }

  private buildArgs(config: WorkerConfig): string[] {
    switch (config.type) {
      case 'ralphy':
        return [config.command];
      case 'jcodemunch':
        return ['--input', config.command, '--output', config.args?.[0] || 'output.json'];
      case 'uncodixfy':
        return [config.command, config.args?.[0] || 'output.json'];
      case 'typescript':
        return ['tsc', '--noEmit'];
      case 'build':
        return ['run', 'build'];
      default:
        return [config.command, ...(config.args || [])];
    }
  }

  private async executeCommand(
    command: string,
    args: string[],
    cwd: string,
    env: NodeJS.ProcessEnv
  ): Promise<{ success: boolean; output: string; error?: string }> {
    return new Promise((resolve) => {
      const process = spawn(command, args, {
        cwd,
        env,
        stdio: 'pipe',
      });

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      process.on('close', (code: number) => {
        if (code === 0) {
          resolve({
            success: true,
            output: stdout,
            error: stderr,
          });
        } else {
          resolve({
            success: false,
            output: stdout,
            error: stderr,
          });
        }
      });

      process.on('error', (error) => {
        resolve({
          success: false,
          output: '',
          error: error.message,
        });
      });
    });
  }

  async executeRalphyTask(command: string, cwd?: string): Promise<WorkerResult> {
    return this.executeWorker({
      type: 'ralphy',
      command,
      cwd,
    });
  }

  async executeJcodemunch(input: string, output?: string, cwd?: string): Promise<WorkerResult> {
    return this.executeWorker({
      type: 'jcodemunch',
      command: input,
      args: output ? [output] : [],
      cwd,
    });
  }

  async executeUncodixfy(input: string, output?: string, cwd?: string): Promise<WorkerResult> {
    return this.executeWorker({
      type: 'uncodixfy',
      command: input,
      args: output ? [output] : [],
      cwd,
    });
  }

  async executeTypecheck(cwd?: string): Promise<WorkerResult> {
    return this.executeWorker({
      type: 'typescript',
      command: '--noEmit',
      cwd,
    });
  }

  async executeBuild(cwd?: string): Promise<WorkerResult> {
    return this.executeWorker({
      type: 'build',
      command: 'build',
      cwd,
    });
  }

  async executeLint(cwd?: string): Promise<WorkerResult> {
    return this.executeWorker({
      type: 'typescript',
      command: 'eslint',
      args: ['.'],
      cwd,
    });
  }

  getActiveJobs(): string[] {
    return Array.from(this.activeJobs.keys());
  }

  cancelJob(jobId: string): boolean {
    if (this.activeJobs.has(jobId)) {
      clearTimeout(this.activeJobs.get(jobId)!);
      this.activeJobs.delete(jobId);
      return true;
    }
    return false;
  }

  async getWorkerStats(): Promise<{
    totalJobs: number;
    activeJobs: number;
    completedJobs: number;
    averageDuration: number;
  }> {
    const activeJobs = this.getActiveJobs().length;
    // In a real implementation, you'd track completed jobs and duration
    return {
      totalJobs: activeJobs + 100, // Mock data
      activeJobs,
      completedJobs: 100, // Mock data
      averageDuration: 45000, // Mock data
    };
  }
}

// Export singleton instance
export default WorkerRunner.getInstance();
