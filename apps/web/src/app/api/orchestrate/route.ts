import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import orchestrator from '@/lib/orchestrator';
import workerRunner from '@/lib/workerRunner';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// JWT middleware
function verifyToken(request: NextRequest): { userId: string; email: string } | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

// POST - Create and execute job
export async function POST(request: NextRequest) {
  try {
    // Verify JWT token
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, payload, priority, worker } = body;

    // Validate input
    if (!type || !['build', 'deploy', 'test', 'lint', 'typecheck', 'ralphy', 'jcodemunch', 'uncodixfy'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid job type' },
        { status: 400 }
      );
    }

    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Payload is required' },
        { status: 400 }
      );
    }

    // Create job via orchestrator
    const jobId = await orchestrator.createJob(type as any, payload, priority || 1);

    // If specific worker requested, execute via workerRunner
    if (worker) {
      let result;
      switch (worker) {
        case 'ralphy':
          result = await workerRunner.executeRalphyTask(payload.command, payload.cwd);
          break;
        case 'jcodemunch':
          result = await workerRunner.executeJcodemunch(payload.input, payload.output, payload.cwd);
          break;
        case 'uncodixfy':
          result = await workerRunner.executeUncodixfy(payload.input, payload.output, payload.cwd);
          break;
        case 'typescript':
          result = await workerRunner.executeTypecheck(payload.cwd);
          break;
        case 'build':
          result = await workerRunner.executeBuild(payload.cwd);
          break;
        default:
          return NextResponse.json(
            { success: false, message: 'Unknown worker type' },
            { status: 400 }
          );
      }

      return NextResponse.json({
        success: true,
        jobId,
        worker,
        result,
      });
    }

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Job queued for execution',
    });

  } catch (error) {
    console.error('Orchestration error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create job' },
      { status: 500 }
    );
  }
}

// GET - Get job status and system status
export async function GET(request: NextRequest) {
  try {
    // Verify JWT token
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (jobId) {
      // Get specific job status
      const job = await orchestrator.getJobStatus(jobId);
      if (!job) {
        return NextResponse.json(
          { success: false, message: 'Job not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        job,
      });
    } else {
      // Get system status
      const workers = await orchestrator.getWorkerStatus();
      const queue = await orchestrator.getQueueStatus();
      const workerStats = await workerRunner.getWorkerStats();

      return NextResponse.json({
        success: true,
        system: {
          workers: workers.length,
          activeWorkers: workers.filter(w => w.status === 'busy').length,
          idleWorkers: workers.filter(w => w.status === 'idle').length,
          queue: {
            pending: queue.pending,
            running: queue.running,
            total: queue.pending + queue.running,
          },
          stats: workerStats,
        },
        workers,
        queue,
      });
    }

  } catch (error) {
    console.error('Status retrieval error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve status' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel job
export async function DELETE(request: NextRequest) {
  try {
    // Verify JWT token
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Cancel active job via workerRunner
    const cancelled = workerRunner.cancelJob(jobId);
    
    if (cancelled) {
      return NextResponse.json({
        success: true,
        jobId,
        message: 'Job cancelled successfully',
      });
    }

    return NextResponse.json({
      success: false,
      jobId,
      message: 'Job not found or not active',
    });

  } catch (error) {
    console.error('Job cancellation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cancel job' },
      { status: 500 }
    );
  }
}