const jwt=require('jsonwebtoken');
const secretKey=process.env.JWT_AUTHENTICATION_KEY;

exports.fetchUserData=(token)=>{
    let execution=true;
        try {
            const data=jwt.verify(token,secretKey);
            return data.user;
            
        } catch (error) {
            execution=false;
            res.status(500).json({execution});
        }
}; 