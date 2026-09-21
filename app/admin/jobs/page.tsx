'use client';

import React, { useState } from 'react';
import { Activity, Play, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { jobManager, BackgroundJob } from '@/lib/jobs';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<BackgroundJob[]>(jobManager.getJobs());
  const [runningJobId, setRunningJobId] = useState<string | null>(null);

  const handleTriggerJob = async (jobId: string) => {
    setRunningJobId(jobId);
    try {
      const updated = await jobManager.triggerJob(jobId);
      setJobs(jobs.map((j) => (j.id === jobId ? updated : j)));
    } finally {
      setRunningJobId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
            Background Jobs & Schedulers
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated task orchestration for catalog updates, price alerts, and analytics rollups (Section 73)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <Card
            key={job.id}
            className="rounded-3xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {job.name}
                </h3>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                  {job.category}
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60 uppercase">
                  {job.status}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{job.schedule}</span>
                </span>
                <span>•</span>
                <span>Last run: {new Date(job.lastRunAt).toLocaleTimeString()}</span>
                <span>•</span>
                <span>Processed: {job.recordsProcessed} items ({job.durationMs}ms)</span>
              </div>
            </div>

            <Button
              onClick={() => handleTriggerJob(job.id)}
              disabled={runningJobId === job.id}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-bold gap-1.5 shrink-0"
            >
              <Play className={`h-3 w-3 ${runningJobId === job.id ? 'animate-spin' : ''}`} />
              <span>{runningJobId === job.id ? 'Executing...' : 'Run Now'}</span>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
