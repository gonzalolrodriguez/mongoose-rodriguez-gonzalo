import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: "Token de autenticación requerido"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: "Token inválido"
        });
    }
};