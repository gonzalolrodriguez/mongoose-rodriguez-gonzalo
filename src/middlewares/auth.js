import jwt from 'jsonwebtoken';

//middleware para verificar si el usuario es vendedor
export const requireSeller = (req, res, next) => {
    if (!req.user || req.user.userType !== 'seller') {
        return res.status(403).json({ ok: false, msg: 'Acceso solo para vendedores' });
    }
    next();
};

//middleware para autenticar el token JWT
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ ok: false, msg: 'No autorizado' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
        req.user = decoded;
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ ok: false, msg: 'Token inválido' });
    }
};