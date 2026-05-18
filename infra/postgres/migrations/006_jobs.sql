-- Create jobs table for orchestration system
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('build', 'deploy', 'test', 'lint', 'typecheck', 'ralphy', 'jcodemunch', 'uncodixfy')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    priority INTEGER NOT NULL DEFAULT 1 CHECK (priority >= 1 AND priority <= 10),
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    result JSONB,
    error TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_type ON jobs(type);
CREATE INDEX idx_jobs_priority ON jobs(priority);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
CREATE INDEX idx_jobs_started_at ON jobs(started_at);
CREATE INDEX idx_jobs_completed_at ON jobs(completed_at);

-- Create index for queue processing
CREATE INDEX idx_jobs_queue ON jobs(status, priority, created_at) 
WHERE status IN ('pending', 'running');

-- Create trigger to update completed_at automatically
CREATE OR REPLACE FUNCTION update_completed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND NEW.completed_at IS NULL THEN
        NEW.completed_at = NOW();
    ELSIF NEW.status != 'completed' AND NEW.completed_at IS NOT NULL THEN
        NEW.completed_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_completed_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_completed_at();

-- Create view for active jobs
CREATE OR REPLACE VIEW active_jobs AS
SELECT 
    id,
    type,
    status,
    priority,
    payload,
    created_at,
    started_at,
    completed_at,
    EXTRACT(EPOCH FROM (NOW() - created_at)) AS duration_seconds,
    EXTRACT(EPOCH FROM (NOW() - started_at)) AS running_seconds
FROM jobs
WHERE status IN ('pending', 'running')
ORDER BY priority ASC, created_at ASC;

-- Create function to get queue statistics
CREATE OR REPLACE FUNCTION get_queue_stats()
RETURNS TABLE(
    pending_count BIGINT,
    running_count BIGINT,
    completed_count BIGINT,
    failed_count BIGINT,
    avg_duration_seconds BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) FILTER (WHERE status = 'pending')::BIGINT,
        COUNT(*) FILTER (WHERE status = 'running')::BIGINT,
        COUNT(*) FILTER (WHERE status = 'completed')::BIGINT,
        COUNT(*) FILTER (WHERE status = 'failed')::BIGINT,
        AVG(EXTRACT(EPOCH FROM (completed_at - created_at)))::BIGINT
    FROM jobs
    WHERE created_at > NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON jobs TO webapp;
GRANT SELECT ON active_jobs TO webapp;
GRANT EXECUTE ON FUNCTION get_queue_stats() TO webapp;