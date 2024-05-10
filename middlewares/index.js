import token  from '../utils/index.js'
const middleware = {
    verifyJwt: async(req,res, next) => {
        try {
            if(!req.headers.authorization) throw new Error('Bạn chưa đăng nhập');
            const accessToken = req.headers.authorization.split(" ")[1];
            if (!accessToken) throw new Error();
            const data = token.verifyToken(accessToken);
            if (data._id !== req.params.id) throw new Error();
            req.dataToken = data;
            next();
        } catch (error) {
            res.status(401).send({
                message: error.message ?? 'Bạn không thể thực hiện hành động!',
                data: null
            });
        }
    }
}

export default middleware