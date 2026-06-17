import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { processNexusOrchestration, getSystemPrompt, setSystemPrompt } from "./server/ai.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // === AUTHENTICATION MOCK ENDPOINTS ===
  // In a real system, these would use bcrypt, JWTs, and a secure DB.
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    // Mock validation
    if (email === 'admin@enterprise.ai' && password === 'password') {
      return res.json({
        token: 'jwt_mock_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        user: {
          id: 'u-1001',
          email: 'admin@enterprise.ai',
          name: 'NEXUS Administrator',
          role: 'Super Admin',
          permissions: ['execute:all', 'read:all', 'write:all', 'manage:agents']
        }
      });
    }
    
    // Test other roles
    if (email === 'analyst@enterprise.ai' && password === 'password') {
       return res.json({
        token: 'jwt_mock_analyst',
        user: { id: 'u-1002', email, name: 'Risk Analyst', role: 'Analyst', permissions: ['read:all'] }
      });
    }

    res.status(401).json({ error: "Invalid credentials. Unauthorized access blocked." });
  });

  app.post("/api/auth/logout", (req, res) => {
    res.json({ message: "Session revoked successfully." });
  });

  app.post("/api/auth/refresh", (req, res) => {
    res.json({ token: 'jwt_mock_refreshed_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' });
  });

  app.get("/api/auth/profile", (req, res) => {
    // Requires Authorization header in a real setup
    res.json({ message: "Profile fetched." });
  });

  app.post("/api/auth/forgot-password", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });
    
    // In a real application, you'd send an email here.
    // For our mock, we just return a success message.
    res.json({ 
      message: "If that account exists, a secure reset token has been sent to the registered communication channel.",
      mockToken: "nexus_reset_token_0x9928A" // Providing the token for prototype testing purposes
    });
  });

  app.post("/api/auth/reset-password", (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: "Cryptographic token and new password are required." });
    
    if (token !== "nexus_reset_token_0x9928A") {
      return res.status(401).json({ error: "Invalid or expired cryptographic token." });
    }
    
    res.json({ message: "Authentication credentials updated successfully." });
  });


  // === SYSTEM PROMPT ENDPOINTS ===
  app.get("/api/system-prompt", (req, res) => {
    res.json({ prompt: getSystemPrompt() });
  });

  app.post("/api/system-prompt", (req, res) => {
    const { prompt } = req.body;
    if (typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt must be a string" });
    }
    setSystemPrompt(prompt);
    res.json({ success: true });
  });

  // === API Route for NEXUS-OPS orchestration ===
  app.post("/api/orchestrate", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      console.log(`[NEXUS-OPS] Routing query to orchestration agent...`);
      const result = await processNexusOrchestration(query);
      
      res.json({ result });
    } catch (error: any) {
      console.error("[NEXUS-OPS ERROR]", error);
      res.status(500).json({ 
        error: "Orchestration failed", 
        details: error.message || "Unknown error"
      });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", orchestrator: "NEXUS-OPS" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For Express 4.x we use * to match all remaining routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[NEXUS-OPS] Backend Orchestrator running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
