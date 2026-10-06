const Project = require("../models/Project");

// Task 2 & 5: Optimized retrieval using field projection & ordering
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      attributes: ["id", "title", "description", "status", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit: 50,
    });
    return res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Task 3: Input Validation and Sanitization
exports.createProject = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Validation
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ success: false, message: "Valid project title is required." });
    }

    // Sanitization
    const cleanTitle = title.trim();
    const cleanDesc = description && typeof description === "string" ? description.trim() : "";
    const cleanStatus = ["active", "completed", "archived"].includes(status) ? status : "active";

    const newProject = await Project.create({
      title: cleanTitle,
      description: cleanDesc,
      status: cleanStatus,
      userId: 1,
    });

    return res.status(201).json({ success: true, data: newProject });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// Delete endpoint
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }
    await project.destroy();
    return res.status(200).json({ success: true, message: "Project deleted successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};