require("dotenv").config();

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/swagger/swagger");
const { initStore } = require("./src/data/store");
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: `
    .swagger-ui .topbar { background: linear-gradient(135deg, #4f46e5, #7c3aed); }
    .swagger-ui .topbar-wrapper img { content: none; }
    .swagger-ui .topbar-wrapper::after {
      content: 'Task Manager API';
      color: white;
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: 1px;
    }
  `,
    customSiteTitle: "Task Manager API Docs",
  }),
);

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/profiles", profileRoutes);

// Health check

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() }),
);

// 404

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Error handler

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

initStore().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀  Server running at http://localhost:${PORT}`);
    console.log(`📚  API Docs at   http://localhost:${PORT}/api-docs\n`);
    console.log("   Demo credentials: demo@example.com / demo1234\n");
  });
});
