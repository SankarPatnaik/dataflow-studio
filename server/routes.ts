import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPipelineSchema, 
  insertConnectorSchema, 
  insertJobSchema, 
  insertScheduleSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Pipeline routes
  app.get("/api/pipelines", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session
      const pipelines = await storage.getPipelines(userId);
      res.json(pipelines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pipelines" });
    }
  });

  app.get("/api/pipelines/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pipeline = await storage.getPipeline(id);
      if (!pipeline) {
        return res.status(404).json({ message: "Pipeline not found" });
      }
      res.json(pipeline);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pipeline" });
    }
  });

  app.post("/api/pipelines", async (req, res) => {
    try {
      const validatedData = insertPipelineSchema.parse({
        ...req.body,
        userId: 1 // TODO: Get from session
      });
      const pipeline = await storage.createPipeline(validatedData);
      res.status(201).json(pipeline);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid pipeline data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create pipeline" });
    }
  });

  app.put("/api/pipelines/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const pipeline = await storage.updatePipeline(id, updates);
      if (!pipeline) {
        return res.status(404).json({ message: "Pipeline not found" });
      }
      res.json(pipeline);
    } catch (error) {
      res.status(500).json({ message: "Failed to update pipeline" });
    }
  });

  app.delete("/api/pipelines/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePipeline(id);
      if (!deleted) {
        return res.status(404).json({ message: "Pipeline not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete pipeline" });
    }
  });

  // Connector routes
  app.get("/api/connectors", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session
      const connectors = await storage.getConnectors(userId);
      res.json(connectors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch connectors" });
    }
  });

  app.post("/api/connectors", async (req, res) => {
    try {
      const validatedData = insertConnectorSchema.parse({
        ...req.body,
        userId: 1 // TODO: Get from session
      });
      const connector = await storage.createConnector(validatedData);
      res.status(201).json(connector);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid connector data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create connector" });
    }
  });

  app.post("/api/connectors/:id/test", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.testConnector(id);
      const connector = await storage.getConnector(id);
      res.json({ success, connector });
    } catch (error) {
      res.status(500).json({ message: "Failed to test connector" });
    }
  });

  app.put("/api/connectors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const connector = await storage.updateConnector(id, updates);
      if (!connector) {
        return res.status(404).json({ message: "Connector not found" });
      }
      res.json(connector);
    } catch (error) {
      res.status(500).json({ message: "Failed to update connector" });
    }
  });

  app.delete("/api/connectors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteConnector(id);
      if (!deleted) {
        return res.status(404).json({ message: "Connector not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete connector" });
    }
  });

  // Job routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/pipeline/:pipelineId", async (req, res) => {
    try {
      const pipelineId = parseInt(req.params.pipelineId);
      const jobs = await storage.getJobsByPipeline(pipelineId);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pipeline jobs" });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      const validatedData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(validatedData);
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid job data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  app.put("/api/jobs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const job = await storage.updateJob(id, updates);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to update job" });
    }
  });

  // Schedule routes
  app.get("/api/schedules", async (req, res) => {
    try {
      const schedules = await storage.getSchedules();
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schedules" });
    }
  });

  app.post("/api/schedules", async (req, res) => {
    try {
      const validatedData = insertScheduleSchema.parse(req.body);
      const schedule = await storage.createSchedule(validatedData);
      res.status(201).json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid schedule data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create schedule" });
    }
  });

  app.put("/api/schedules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const schedule = await storage.updateSchedule(id, updates);
      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Failed to update schedule" });
    }
  });

  app.delete("/api/schedules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSchedule(id);
      if (!deleted) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete schedule" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session
      const pipelines = await storage.getPipelines(userId);
      const connectors = await storage.getConnectors(userId);
      const jobs = await storage.getJobs();
      const todayJobs = jobs.filter(job => {
        const today = new Date();
        const jobDate = new Date(job.createdAt);
        return jobDate.toDateString() === today.toDateString();
      });

      const activePipelines = pipelines.filter(p => p.status === "active").length;
      const totalDataSources = connectors.length;
      const jobsToday = todayJobs.length;
      const successfulJobs = todayJobs.filter(j => j.status === "completed").length;
      const successRate = todayJobs.length > 0 ? (successfulJobs / todayJobs.length) * 100 : 0;

      res.json({
        activePipelines,
        dataSources: totalDataSources,
        jobsToday,
        dataProcessed: "2.4TB", // Simulated value
        successRate: successRate.toFixed(1)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
