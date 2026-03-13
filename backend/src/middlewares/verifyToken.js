import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization; 

    if(!authHeader){
        return res.status(401).json({
            success: false, 
            message: "Bạn chưa đăng nhập",
        })
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err){
            return res.status(403).json({
                success: false, 
                message: "Token không hợp lệ",
            })
        }
        req.user = user;
        next();
    })
}