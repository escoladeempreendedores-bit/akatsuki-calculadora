const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../config/swagger.json");
const authMiddleware = require("./middlewares/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const missionRoutes = require("./routes/missionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const costsRoutes = require("./routes/costsRoutes");
const taxesRoutes = require("./routes/taxesRoutes");
const defaultTaxesRoutes = require("./routes/defaultTaxesRoutes");
const dashMissionRoutes = require("./routes/missionDashRoutes");
const generalDashRoutes = require("./routes/generalDashRoutes");
const simulationCostsRoutes = require("./routes/simulationCostsRoutes");

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
origin: ["http://localhost:5173", "https://akatsuki-calculadora-ns5ziskiw-escola-de-empreendedores.vercel.app", "https://akatsuki-calculadora.vercel.app"],
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		credentials: true,
	})
);

app.get("/", (req, res) => {
	res.send("API Calculadora funcionando! 🚀");
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/missions", authMiddleware, missionRoutes);
app.use("/api/missions", authMiddleware, categoryRoutes);
app.use("/api/missions", authMiddleware, taxesRoutes);
app.use("/api/costs", authMiddleware, costsRoutes);
app.use("/api/defaultTaxes", authMiddleware, defaultTaxesRoutes);
app.use("/api/missionDash", authMiddleware, dashMissionRoutes);
app.use("/api/generalDash", authMiddleware, generalDashRoutes);
app.use("/api/simulationCosts", authMiddleware, simulationCostsRoutes);


module.exports = app;
