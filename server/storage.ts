import { 
  users, pipelines, connectors, jobs, schedules,
  type User, type InsertUser, 
  type Pipeline, type InsertPipeline,
  type Connector, type InsertConnector,
  type Job, type InsertJob,
  type Schedule, type InsertSchedule
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Pipeline methods
  getPipelines(userId: number): Promise<Pipeline[]>;
  getPipeline(id: number): Promise<Pipeline | undefined>;
  createPipeline(pipeline: InsertPipeline): Promise<Pipeline>;
  updatePipeline(id: number, updates: Partial<InsertPipeline>): Promise<Pipeline | undefined>;
  deletePipeline(id: number): Promise<boolean>;

  // Connector methods
  getConnectors(userId: number): Promise<Connector[]>;
  getConnector(id: number): Promise<Connector | undefined>;
  createConnector(connector: InsertConnector): Promise<Connector>;
  updateConnector(id: number, updates: Partial<InsertConnector>): Promise<Connector | undefined>;
  deleteConnector(id: number): Promise<boolean>;
  testConnector(id: number): Promise<boolean>;

  // Job methods
  getJobs(): Promise<Job[]>;
  getJobsByPipeline(pipelineId: number): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, updates: Partial<InsertJob>): Promise<Job | undefined>;

  // Schedule methods
  getSchedules(): Promise<Schedule[]>;
  getSchedulesByPipeline(pipelineId: number): Promise<Schedule[]>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateSchedule(id: number, updates: Partial<InsertSchedule>): Promise<Schedule | undefined>;
  deleteSchedule(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pipelines: Map<number, Pipeline>;
  private connectors: Map<number, Connector>;
  private jobs: Map<number, Job>;
  private schedules: Map<number, Schedule>;
  private currentUserId: number;
  private currentPipelineId: number;
  private currentConnectorId: number;
  private currentJobId: number;
  private currentScheduleId: number;

  constructor() {
    this.users = new Map();
    this.pipelines = new Map();
    this.connectors = new Map();
    this.jobs = new Map();
    this.schedules = new Map();
    this.currentUserId = 1;
    this.currentPipelineId = 1;
    this.currentConnectorId = 1;
    this.currentJobId = 1;
    this.currentScheduleId = 1;

    // Initialize with some default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default user
    const defaultUser: User = {
      id: 1,
      username: "admin",
      password: "password"
    };
    this.users.set(1, defaultUser);
    this.currentUserId = 2;

    // Create sample connectors
    const oracleConnector: Connector = {
      id: 1,
      name: "Oracle Production",
      type: "oracle",
      configuration: {
        host: "prod-oracle.company.com",
        port: 1521,
        database: "ORDERS_DB",
        username: "etl_user"
      },
      status: "active",
      lastTested: new Date(),
      createdAt: new Date(),
      userId: 1
    };

    const mongoConnector: Connector = {
      id: 2,
      name: "MongoDB Atlas",
      type: "mongodb",
      configuration: {
        connectionString: "mongodb+srv://cluster0.mongodb.net",
        database: "user_events"
      },
      status: "active",
      lastTested: new Date(),
      createdAt: new Date(),
      userId: 1
    };

    const hiveConnector: Connector = {
      id: 3,
      name: "Cloudera Hive",
      type: "hive",
      configuration: {
        server: "hadoop-master.local",
        port: 10000,
        database: "analytics"
      },
      status: "inactive",
      lastTested: new Date(Date.now() - 3600000), // 1 hour ago
      createdAt: new Date(),
      userId: 1
    };

    this.connectors.set(1, oracleConnector);
    this.connectors.set(2, mongoConnector);
    this.connectors.set(3, hiveConnector);
    this.currentConnectorId = 4;

    // Create sample pipeline
    const samplePipeline: Pipeline = {
      id: 1,
      name: "Customer Data ETL",
      description: "Extract customer data from Oracle, transform and load to Hive",
      configuration: {
        nodes: [
          { id: "1", type: "source", sourceType: "oracle", position: { x: 100, y: 100 } },
          { id: "2", type: "transform", transformType: "filter", position: { x: 300, y: 100 } },
          { id: "3", type: "destination", destinationType: "hive", position: { x: 500, y: 100 } }
        ],
        connections: [
          { source: "1", target: "2" },
          { source: "2", target: "3" }
        ],
        yamlConfig: `
transformations:
  - name: "customer_cleansing"
    type: "data_quality"
    rules:
      - field: "email"
        validation: "email_format"
      - field: "phone"
        standardize: "e164_format"

sources:
  oracle_orders:
    connection: "prod_oracle"
    query: "SELECT * FROM customers WHERE created_date >= '2024-01-01'"
    
targets:
  hive_warehouse:
    table: "analytics.customers_clean"
    mode: "append"
        `
      },
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1
    };

    this.pipelines.set(1, samplePipeline);
    this.currentPipelineId = 2;

    // Create sample jobs
    const runningJob: Job = {
      id: 1,
      pipelineId: 1,
      status: "running",
      startTime: new Date(Date.now() - 750000), // 12.5 minutes ago
      endTime: undefined,
      progress: 45,
      logs: ["Started pipeline execution", "Extracting data from Oracle", "Processing 10,000 records"],
      errorMessage: undefined,
      createdAt: new Date(Date.now() - 750000)
    };

    const queuedJob: Job = {
      id: 2,
      pipelineId: 1,
      status: "queued",
      startTime: undefined,
      endTime: undefined,
      progress: 0,
      logs: ["Job queued for execution"],
      errorMessage: undefined,
      createdAt: new Date()
    };

    this.jobs.set(1, runningJob);
    this.jobs.set(2, queuedJob);
    this.currentJobId = 3;

    // Create sample schedule
    const dailySchedule: Schedule = {
      id: 1,
      pipelineId: 1,
      cronExpression: "0 2 * * *", // Daily at 2 AM
      isActive: true,
      nextRun: new Date(Date.now() + 86400000), // Tomorrow at 2 AM
      lastRun: new Date(Date.now() - 86400000), // Yesterday at 2 AM
      createdAt: new Date()
    };

    this.schedules.set(1, dailySchedule);
    this.currentScheduleId = 2;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Pipeline methods
  async getPipelines(userId: number): Promise<Pipeline[]> {
    return Array.from(this.pipelines.values()).filter(pipeline => pipeline.userId === userId);
  }

  async getPipeline(id: number): Promise<Pipeline | undefined> {
    return this.pipelines.get(id);
  }

  async createPipeline(insertPipeline: InsertPipeline): Promise<Pipeline> {
    const id = this.currentPipelineId++;
    const now = new Date();
    const pipeline: Pipeline = { 
      ...insertPipeline, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.pipelines.set(id, pipeline);
    return pipeline;
  }

  async updatePipeline(id: number, updates: Partial<InsertPipeline>): Promise<Pipeline | undefined> {
    const pipeline = this.pipelines.get(id);
    if (!pipeline) return undefined;
    
    const updatedPipeline = { 
      ...pipeline, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.pipelines.set(id, updatedPipeline);
    return updatedPipeline;
  }

  async deletePipeline(id: number): Promise<boolean> {
    return this.pipelines.delete(id);
  }

  // Connector methods
  async getConnectors(userId: number): Promise<Connector[]> {
    return Array.from(this.connectors.values()).filter(connector => connector.userId === userId);
  }

  async getConnector(id: number): Promise<Connector | undefined> {
    return this.connectors.get(id);
  }

  async createConnector(insertConnector: InsertConnector): Promise<Connector> {
    const id = this.currentConnectorId++;
    const connector: Connector = { 
      ...insertConnector, 
      id, 
      createdAt: new Date(),
      lastTested: undefined
    };
    this.connectors.set(id, connector);
    return connector;
  }

  async updateConnector(id: number, updates: Partial<InsertConnector>): Promise<Connector | undefined> {
    const connector = this.connectors.get(id);
    if (!connector) return undefined;
    
    const updatedConnector = { ...connector, ...updates };
    this.connectors.set(id, updatedConnector);
    return updatedConnector;
  }

  async deleteConnector(id: number): Promise<boolean> {
    return this.connectors.delete(id);
  }

  async testConnector(id: number): Promise<boolean> {
    const connector = this.connectors.get(id);
    if (!connector) return false;
    
    // Simulate connection test
    const isSuccessful = Math.random() > 0.2; // 80% success rate
    const updatedConnector = {
      ...connector,
      status: isSuccessful ? "active" : "error",
      lastTested: new Date()
    };
    
    this.connectors.set(id, updatedConnector);
    return isSuccessful;
  }

  // Job methods
  async getJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values());
  }

  async getJobsByPipeline(pipelineId: number): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(job => job.pipelineId === pipelineId);
  }

  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = this.currentJobId++;
    const job: Job = { 
      ...insertJob, 
      id, 
      createdAt: new Date() 
    };
    this.jobs.set(id, job);
    return job;
  }

  async updateJob(id: number, updates: Partial<InsertJob>): Promise<Job | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { ...job, ...updates };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  // Schedule methods
  async getSchedules(): Promise<Schedule[]> {
    return Array.from(this.schedules.values());
  }

  async getSchedulesByPipeline(pipelineId: number): Promise<Schedule[]> {
    return Array.from(this.schedules.values()).filter(schedule => schedule.pipelineId === pipelineId);
  }

  async createSchedule(insertSchedule: InsertSchedule): Promise<Schedule> {
    const id = this.currentScheduleId++;
    const schedule: Schedule = { 
      ...insertSchedule, 
      id, 
      createdAt: new Date() 
    };
    this.schedules.set(id, schedule);
    return schedule;
  }

  async updateSchedule(id: number, updates: Partial<InsertSchedule>): Promise<Schedule | undefined> {
    const schedule = this.schedules.get(id);
    if (!schedule) return undefined;
    
    const updatedSchedule = { ...schedule, ...updates };
    this.schedules.set(id, updatedSchedule);
    return updatedSchedule;
  }

  async deleteSchedule(id: number): Promise<boolean> {
    return this.schedules.delete(id);
  }
}

export const storage = new MemStorage();
