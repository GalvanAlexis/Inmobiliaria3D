using System;
using System.Collections.Generic;

namespace Inmobiliaria3D.Api.Models
{
    public enum StitchJobStatus
    {
        Pending,
        Processing,
        Completed,
        Failed
    }

    public class StitchJob
    {
        public Guid Id { get; set; }
        public StitchJobStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public List<string> InputImagePaths { get; set; } = new List<string>();
        public string? ResultImagePath { get; set; }
        public string? ErrorMessage { get; set; }

        public StitchJob()
        {
            Id = Guid.NewGuid();
            Status = StitchJobStatus.Pending;
            CreatedAt = DateTime.UtcNow;
        }
    }
}
