const jwt=require('jsonwebtoken');
const secretKey=process.env.JWT_AUTHENTICATION_KEY;

exports.fetchUserData=(token,res)=>{
    let execution=true;
        try {
            const data=jwt.verify(token,secretKey);
            return data.user;
            
        } catch (error) {
            execution=false;
            (error);
            res.send(500).json({execution});
        }
}; 