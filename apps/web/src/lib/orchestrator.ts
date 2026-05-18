import { NextRequest, NextResponse } from 'next/server';
import pool from './db';

export interface Job {
  id: string;
  type: 'build' | 'deploy' | 'test' | 'lint' | 'typecheck';
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: number;
  payload: any;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
}

export interface Worker {
  id: string;
  type: 'ralphy' | 'jcodemunch' | 'uncodixfy' | 'typescript' | 'build';
  status: 'idle' | 'busy' | 'error';
  currentJob?: string;
  lastHeartbeat: Date;
}

export class Orchestrator {
  private jobs: Map<string, Job> = new Map();
  private workers: Map<string, Worker> = new Map();
  private jobQueue: string[] = [];
  private maxWorkers = 4;

  constructor() {
    this.initializeWorkers();
    this.startJobProcessor();
  }

  private initializeWorkers() {
    const workerTypes: Worker['type'][] = ['ralphy', 'jcodemunch', 'uncodixfy', 'typescript'];
    
    workerTypes.forEach(type => {
      const worker: Worker = {
        id: `${type}-${Date.now()}`,
        type,
        status: 'idle',
        lastHeartbeat: new Date(),
      };
      this.workers.set(worker.id, worker);
    });
  }

  private startJobProcessor() {
    setInterval(() => {
      this.processJobQueue();
    }, 1000);
  }

  private async processJobQueue() {
    if (this.jobQueue.length === 0) return;
    
    const availableWorker = Array.from(this.workers.values())
      .find(w => w.status === 'idle');
    
    if (!availableWorker) return;
    
    const jobId = this.jobQueue.shift()!;
    const job = this.jobs.get(jobId);
    
    if (job) {
      await this.executeJob(job, availableWorker);
    }
  }

  private async executeJob(job: Job, worker: Worker) {
    job.status = 'running';
    job.startedAt = new Date();
    worker.status = 'busy';
    worker.currentJob = job.id;
    worker.lastHeartbeat = new Date();

    try {
      let result;
      
      switch (job.type) {
        case 'build':
          result = await this.executeBuild(job.payload);
          break;
        case 'typecheck':
          result = await this.executeTypecheck(job.payload);
          break;
        case 'lint':
          result = await this.executeLint(job.payload);
          break;
        case 'ralphy':
          result = await this.executeRalphy(job.payload);
          break;
        case 'jcodemunch':
          result = await this.executeJcodemunch(job.payload);
          break;
        case 'uncodixfy':
          result = await this.executeUncodixfy(job.payload);
          break;
        default:
          throw new Error(`Unknown job type: ${job.type}`);
      }

      job.status = 'completed';
      job.completedAt = new Date();
      job.result = result;
      
    } catch (error) {
      job.status = 'failed';
      job.completedAt = new Date();
      job.error = error instanceof Error ? error.message : 'Unknown error';
    }

    worker.status = 'idle';
    worker.currentJob = undefined;
    worker.lastHeartbeat = new Date();

    await this.saveJob(job);
  }

  private async executeBuild(payload: any): Promise<any> {
    const { path, command } = payload;
    const { spawn } = require('child_process');
    
    return new Promise((resolve, reject) => {
      const process = spawn('npm', ['run', 'build'], { 
        cwd: path || process.cwd(),
        stdio: 'pipe'
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
          resolve({ success: true, stdout, stderr });
        } else {
          reject(new Error(`Build failed with code ${code}: ${stderr}`));
        }
      });
    });
  }

  private async executeTypecheck(payload: any): Promise<any> {
    const { path } = payload;
    const { spawn } = require('child_process');
    
    return new Promise((resolve, reject) => {
      const process = spawn('npx', ['tsc', '--noEmit'], { 
        cwd: path || process.cwd(),
        stdio: 'pipe'
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
          resolve({ success: true, stdout, stderr });
        } else {
          resolve({ success: false, errors: stderr, code });
        }
      });
    });
  }

  private async executeLint(payload: any): Promise<any> {
    const { path } = payload;
    const { spawn } = require('child_process');
    
    return new Promise((resolve, reject) => {
      const process = spawn('npx', ['eslint', '.'], { 
        cwd: path || process.cwd(),
        stdio: 'pipe'
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
        resolve({ success: code === 0, stdout, stderr, code });
      });
    });
  }

  private async executeRalphy(payload: any): Promise<any> {
    const { command, path } = payload;
    const { spawn } = require('child_process');
    
    return new Promise((resolve, reject) => {
      const ralphyPath = `${process.cwd()}/ralphy/cli/bin.js`;
      const process = spawn('node', [ralphyPath, command], { 
        cwd: path || process.cwd(),
        stdio: 'pipe'
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
          resolve({ success: true, stdout, stderr });
        } else {
          reject(new Error(`Ralphy failed with code ${code}: ${stderr}`));
        }
      });
    });
  }

  private async executeJcodemunch(payload: any): Promise<any> {
    const { input, output } = payload;
    const { spawn } = require('child_process');
    
    return new Promise((resolve, reject) => {
      const jcodemunchPath = `${process.cwd()}/jcodemunch-mcp/index.js`;
      const process = spawn('node', [jcodemunchPath, '--input', input, '--output', output], { 
        stdio: 'pipe'
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
          resolve({ success: true, stdout, stderr });
        } else {
          reject(new Error(`jcodemunch failed with code ${code}: ${stderr}`));
        }
      });
    });
  }

  private async executeUncodixfy(payload: any): Promise<any> {
    const { input, output } = payload;
    const { spawn } = require('child_process');
    
    return new Promise((resolve, reject) => {
      const uncodixfyPath = `${process.cwd()}/pauli-Uncodixfy/index.js`;
      const process = spawn('node', [uncodixfyPath, input, output], { 
        stdio: 'pipe'
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
          resolve({ success: true, stdout, stderr });
        } else {
          reject(new Error(`Uncodixfy failed with code ${code}: ${stderr}`));
        }
      });
    });
  }

  private async saveJob(job: Job): Promise<void> {
    const query = `
      INSERT INTO jobs (id, type, status, priority, payload, created_at, started_at, completed_at, result, error)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        status = $3,
        priority = $4,
        payload = $5,
        started_at = $7,
        completed_at = $8,
        result = $9,
        error = $10;
    `;

    await pool.query(query, [
      job.id,
      job.type,
      job.status,
      job.priority,
      JSON.stringify(job.payload),
      job.createdAt,
      job.startedAt,
      job.completedAt,
      JSON.stringify(job.result),
      job.error,
    ]);
  }

  public async createJob(type: Job['type'], payload: any, priority: number = 1): Promise<string> {
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const job: Job = {
      id: jobId,
      type,
      status: 'pending',
      priority,
      payload,
      createdAt: new Date(),
    };

    this.jobs.set(jobId, job);
    this.jobQueue.push(jobId);
    
    await this.saveJob(job);
    return jobId;
  }

  public async getJobStatus(jobId: string): Promise<Job | null> {
    const job = this.jobs.get(jobId);
    if (job) return job;

    const query = 'SELECT * FROM jobs WHERE id = $1';
    const result = await pool.query(query, [jobId]);
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      id: row.id,
      type: row.type,
      status: row.status,
      priority: row.priority,
      payload: JSON.parse(row.payload || '{}'),
      createdAt: row.created_at,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      result: row.result ? JSON.parse(row.result) : undefined,
      error: row.error,
    };
  }

  public async getWorkerStatus(): Promise<Worker[]> {
    return Array.from(this.workers.values());
  }

  public async getQueueStatus(): Promise<{ pending: number; running: number }> {
    const pending = this.jobQueue.length;
    const running = Array.from(this.jobs.values()).filter(j => j.status === 'running').length;
    return { pending, running };
  }
}

const orchestrator = new Orchestrator();
export default orchestrator;