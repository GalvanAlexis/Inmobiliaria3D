using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Inmobiliaria3D.Api.Models;
using Inmobiliaria3D.Api.Services;

namespace Inmobiliaria3D.Api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class StitchController : ControllerBase
    {
        private readonly StitchService _stitchService;
        private readonly string _uploadDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

        public StitchController(StitchService stitchService)
        {
            _stitchService = stitchService;
            if (!Directory.Exists(_uploadDirectory))
            {
                Directory.CreateDirectory(_uploadDirectory);
            }
        }

        [HttpPost("upload")]
        [RequestSizeLimit(150_000_000)] // 150 MB limit
        public async Task<IActionResult> UploadImages([FromForm] IFormFileCollection images)
        {
            if (images == null || images.Count == 0)
            {
                return BadRequest("No images were provided.");
            }

            var job = new StitchJob();
            var jobDir = Path.Combine(_uploadDirectory, job.Id.ToString());
            Directory.CreateDirectory(jobDir);

            foreach (var file in images)
            {
                if (file.Length > 0)
                {
                    var filePath = Path.Combine(jobDir, file.FileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    job.InputImagePaths.Add(filePath);
                }
            }

            // In Phase 3, we will trigger the Python Worker here.
            // For now, we just save the state.
            _stitchService.AddJob(job);

            return Accepted(new { JobId = job.Id, Status = job.Status.ToString(), Message = "Images received. Processing pending." });
        }

        [HttpGet("status/{id}")]
        public IActionResult GetStatus(Guid id)
        {
            var job = _stitchService.GetJob(id);
            if (job == null)
            {
                return NotFound("Job not found.");
            }

            return Ok(new {
                JobId = job.Id,
                Status = job.Status.ToString(),
                CreatedAt = job.CreatedAt,
                CompletedAt = job.CompletedAt,
                ErrorMessage = job.ErrorMessage
            });
        }

        [HttpGet("result/{id}")]
        public IActionResult GetResult(Guid id)
        {
            var job = _stitchService.GetJob(id);
            if (job == null) return NotFound("Job not found.");
            if (job.Status != StitchJobStatus.Completed) return BadRequest("Job is not completed yet.");
            if (string.IsNullOrEmpty(job.ResultImagePath) || !System.IO.File.Exists(job.ResultImagePath)) 
                return NotFound("Result image not found.");

            var fileBytes = System.IO.File.ReadAllBytes(job.ResultImagePath);
            return File(fileBytes, "image/jpeg");
        }
    }
}
