const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			return res.status(401).json({ error: "Token não fornecido" });
		}

		const token = authHeader.startsWith("Bearer ")
			? authHeader.slice(7)
			: authHeader;

		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "AkatsukiSecretKey17112025"
		);

		// Armazena as informações do usuário no objeto req para uso nos controllers
		const userId = decoded.id || decoded.userId;
		req.userId = userId ? parseInt(userId) : null;
		req.userEmail = decoded.email; //QUANDO ADICIONARMOS;
		req.userLevel = decoded.level; //QUANDO ADICIONARMOS;
		req.user = decoded;

		next();
	} catch (error) {
		if (error.name === "JsonWebTokenError") {
			return res.status(401).json({ error: "Token inválido" });
		}
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({ error: "Token expirado" });
		}
		return res.status(401).json({ error: "Falha na autenticação" });
	}
};

module.exports = authMiddleware;
