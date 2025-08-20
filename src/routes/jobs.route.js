// Example jobs.route.js
import express from "express";
import Job from "../models/job.model.js";
const router = express.Router();

// GET /api/jobs
router.get("/", async (req, res) => {
  const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(jobs);
});

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job" });
  }
});

export default router;
