export const authorizedRoles = (...roles) => {
    return (req, res, next) => {
        // QUAN TRỌNG: Sửa req.user.roles -> req.user.role cho khớp với payload Token
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false, 
                message: "Bạn không có quyền truy cập!"
            });
        }
        next();
    };
};