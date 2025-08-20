import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import Job from "../models/job.model.js";
import User from "../models/user.model.js";

const router = express.Router();


// GET /api/admin/jobs/count
router.get('/jobs/count', async (req, res) => {
  const count = await Job.countDocuments();
  res.json({ count });
});

// GET /api/admin/mentors/count
router.get('/mentors/count', async (req, res) => {
  const count = await User.countDocuments({ role: 'mentor' });
  res.json({ count });
});

// GET /api/admin/users/count
router.get('/users/count', async (req, res) => {
  const count = await User.countDocuments();
  res.json({ count });
});

// Create
router.post("/jobs", protectRoute, requireAdmin, async (req, res) => {
  try {
    const { title, company, location, type, description, requirements, applyUrl, isActive,logo } = req.body;
    if (!title || !company || !description || !applyUrl || !logo) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const job = await Job.create({
      title,logo, company, location, type, description,
      requirements: requirements || [],
      applyUrl,
      postedBy: req.existingUser._id,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json(job);
  } catch (e) {
    console.error("Create job error:", e.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update
router.put("/jobs/:id", protectRoute, requireAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (e) {
    console.error("Update job error:", e.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete
router.delete("/jobs/:id", protectRoute, requireAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted" });
  } catch (e) {
    console.error("Delete job error:", e.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Public list
router.get("/jobs", async (_req, res) => {
  const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(jobs);
});

// Public details
router.get("/jobs/:id", async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job || !job.isActive) return res.status(404).json({ message: "Job not found" });
  res.json(job);
});


export default router;
