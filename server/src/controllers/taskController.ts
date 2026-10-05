import { Response } from "express";
import Task from "../models/Task.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({
      userId: req.userId,
    }).sort({
      completed: 1,
      deadline: 1,
    });

    return res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      dateTime,
      deadline,
      priority,
    } = req.body;

    if (!title || !dateTime || !deadline) {
      return res.status(400).json({
        message: "Title, date-time and deadline are required",
      });
    }

    const task = await Task.create({
      userId: req.userId,
      title,
      description,
      dateTime,
      deadline,
      priority: priority || "medium",
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      message: "Failed to create task",
    });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        userId: req.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.json(task);
  } catch (error) {
    console.error("Update task error:", error);

    return res.status(500).json({
      message: "Failed to update task",
    });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      message: "Failed to delete task",
    });
  }
};