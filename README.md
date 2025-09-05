# Me-API Playground

## 1. Architecture

The project follows a service-oriented architecture with a clear separation of concerns:  

- **Backend**
  - Framework: [Hono](https://hono.dev) (running on Bun runtime)
  - Database ORM: [Prisma](https://www.prisma.io/) with MongoDB
  - Deployment: Render (serverless deployment)
  - Responsibilities:
    - Exposes REST endpoints for profile management (`/profile`), query handling (`/query`), and liveness (`/health`)
    - Applies CORS policies for local development and deployed frontend
    - Uses Prisma client for data persistence

- **Frontend**
  - Framework: React
  - Hosting: Vercel
  - Responsibilities:
    - Provides a user interface for interacting with backend APIs
    - Communicates with backend endpoints securely through CORS

---

## 2. Setup Instructions

### Local Development

**Prerequisites**
- Bun runtime installed  
- MongoDB instance running (local or cloud such as Atlas)  
- Node.js (for frontend)  

**Steps**
1. Clone the repository:
   ```bash
   git clone https://github.com/saiteja2873/Me-API-Playground.git
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   bun install
   ```
3. Configure environment variables in .env:
   ```bash
   DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority
   ```
4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
5. Start the backend server:
   ```bash
   bun run src/index.ts
   ```
   - The server will be available at http://localhost:3001.

6. For frontend setup:
   ```bash
   cd frontend
   npm install
   npm run dev
    ```
    - The frontend will run at http://localhost:3000.
  
### Production Deployment

- **Backend**:  
  - Deploy to Render by connecting the GitHub repository.  
  - Configure environment variables under Render - Environment.  
  - Use the build/start commands defined in `package.json`.  
  - Health check path configured as `/health`.

- **Frontend**:  
  - Deploy to Vercel by connecting the frontend repository.  
  - Ensure the backend API base URL points to the Render deployment.

## Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Profile {
  id        String   @id @map("_id") @default(auto()) @db.ObjectId
  name      String
  email     String
  education String?
  skills    String[]
  projects  Project[]
  work      Work[]
  links     Links?
}

type Project {
  title       String
  description String?
  link        String?
  pskills     String[] @default([])
}

type Work {
  role        String
  company     String
  duration    String?
  description String?
}

type Links {
  github    String?
  linkedin  String?
  portfolio String?
}
```

## Postman Collection

You can download and import the Postman collection for this project:

[Sample Me-API Playground Postman Collection](./postman/Me-API%20Playground.postman_collection.json)

## Known Limitations

1. **No Authentication/Authorization:** All backend endpoints are publicly accessible; sensitive data protection is not enforced.  
2. **In-Memory Search:** `/query/search` and `/query/projects` perform filtering in memory, which may be inefficient for large datasets.  
3. **No Pagination or Rate Limiting:** Endpoints return full datasets without pagination, and there is no request throttling.  
4. **Deployment Performance:** No backend caching, query optimization, or horizontal scaling is configured for production.  

## Resume

You can view or download my resume here:

[Download Resume](./docs/ResumeSaiTeja.pdf)
