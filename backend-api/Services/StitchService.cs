using System;
using System.Collections.Concurrent;
using Inmobiliaria3D.Api.Models;

namespace Inmobiliaria3D.Api.Services
{
    public class StitchService
    {
        // Simple in-memory store for MVP. In reality, use a Database (Entity Framework).
        private readonly ConcurrentDictionary<Guid, StitchJob> _jobs = new();

        public void AddJob(StitchJob job)
        {
            _jobs[job.Id] = job;
        }

        public StitchJob? GetJob(Guid id)
        {
            _jobs.TryGetValue(id, out var job);
            return job;
        }

        public void UpdateJob(StitchJob job)
        {
            _jobs[job.Id] = job;
        }
    }
}
