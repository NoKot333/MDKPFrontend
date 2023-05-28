    import jwt from 'jsonwebtoken';

    export default (req,res,next) => {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/,'');
        //const token = req.headers.authorization.split(' ')[1];
        if (token) {
            try {
                const decoded = jwt.verify(token,'cipher');
                req.userId = decoded._id;
                next();
            } catch (err) {
                console.log(token);
                console.log(err);
                return res.status(403).json({
                    message:'Нет доступа',
                });
            }
        } else {
            return res.status(403).json({
                message:'Нет доступа',
            });
        }
    }