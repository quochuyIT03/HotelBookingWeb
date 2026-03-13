export const authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.roles)){
            return res.status(403).json({
                success: false, 
                message: "Bạn không có quyền truy cập"
            })
        }
        next();
    }
}
