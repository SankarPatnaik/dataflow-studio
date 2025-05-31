# DataFlow Studio

A no-code ETL (Extract, Transform, Load) framework with visual pipeline designer that simulates the capabilities of enterprise tools like PySpark, Apache Airflow, and Apache Flink.

![DataFlow Studio Dashboard](https://img.shields.io/badge/Status-Production%20Ready-green)
![Tech Stack](https://img.shields.io/badge/Tech%20Stack-React%20%7C%20TypeScript%20%7C%20Node.js-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Features

### Visual Pipeline Builder
- **Drag & Drop Interface**: Intuitive visual pipeline designer
- **Component Toolbox**: Pre-built data sources, transformations, and destinations
- **Real-time Canvas**: Interactive pipeline visualization with connections
- **YAML Configuration**: Advanced configuration through YAML editor

### Data Connectors
- **Oracle Database**: Enterprise database connectivity
- **MongoDB**: NoSQL document database support
- **Apache Hive**: Big data warehouse integration
- **PostgreSQL & MySQL**: Relational database support
- **Connection Testing**: Built-in connectivity validation

### Job Monitoring & Execution
- **Real-time Monitoring**: Live job status and progress tracking
- **Execution Logs**: Detailed logging and error reporting
- **Performance Metrics**: Job duration and success rate analytics
- **Status Management**: Queue, run, pause, and stop operations

### Pipeline Scheduler
- **Cron-based Scheduling**: Flexible time-based automation
- **DAG Visualization**: Directed Acyclic Graph representation
- **Schedule Management**: Enable, disable, and modify schedules
- **Dependency Tracking**: Task dependency management

### Dashboard & Analytics
- **System Overview**: Key metrics and statistics
- **Active Jobs**: Real-time pipeline execution status
- **Data Processing**: Volume and performance tracking
- **Historical Reports**: Success rates and trends

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: In-memory storage (extensible to PostgreSQL)
- **Build Tools**: Vite, ESBuild
- **UI Components**: Radix UI, Shadcn/ui
- **State Management**: TanStack Query

## 📦 Installation

### Prerequisites
- Node.js 20.x or higher
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/dataflow-studio.git
   cd dataflow-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open your browser to `http://localhost:5000`

## 🏗️ Project Structure

```
dataflow-studio/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── connectors/ # Data connector components
│   │   │   ├── jobs/       # Job monitoring components
│   │   │   ├── layout/     # Layout components
│   │   │   ├── pipeline/   # Pipeline builder components
│   │   │   ├── scheduler/  # Scheduler components
│   │   │   └── ui/         # Base UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   └── pages/          # Application pages
├── server/                 # Node.js backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── vite.ts            # Vite integration
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── docs/                  # Documentation
```

## 🎯 Usage Guide

### Creating Your First Pipeline

1. **Navigate to Pipeline Builder**
   - Click on "Pipeline Builder" in the sidebar
   - Start with a blank canvas

2. **Add Data Sources**
   - Drag Oracle, MongoDB, or Hive components from the toolbox
   - Configure connection parameters

3. **Add Transformations**
   - Add Filter, Join, or Aggregate components
   - Define transformation logic in YAML

4. **Add Destinations**
   - Configure data warehouse or file export targets
   - Set up output parameters

5. **Save and Execute**
   - Save your pipeline configuration
   - Click "Run" to execute immediately or schedule for later

### Setting Up Data Connectors

1. **Go to Connectors Page**
   - Click "Add Connector" button
   - Select your database type

2. **Configure Connection**
   - Enter host, port, database credentials
   - Test the connection

3. **Use in Pipelines**
   - Reference connectors in your pipeline configurations
   - Data sources automatically use configured connections

### Monitoring Jobs

1. **Job Monitor Dashboard**
   - View all running and completed jobs
   - Monitor progress and performance

2. **Real-time Updates**
   - Jobs refresh automatically every 5 seconds
   - View detailed logs and error messages

### Scheduling Pipelines

1. **Create Schedule**
   - Select a pipeline to schedule
   - Choose from predefined cron patterns

2. **Manage Schedules**
   - Enable/disable schedules
   - View next run times and history

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=your_database_connection_string
```

### YAML Pipeline Configuration

Example pipeline configuration:

```yaml
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
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation for new features
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎖️ Acknowledgments

- Inspired by enterprise ETL tools like Talend and AbInitio
- Built with modern web technologies
- Designed for ease of use and scalability

## 📞 Support

- Create an issue for bug reports
- Start a discussion for feature requests
- Check the documentation for common questions

---

**DataFlow Studio** - Making ETL accessible to everyone, from data engineers to business analysts.