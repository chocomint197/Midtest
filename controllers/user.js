import { verifyCodes } from '../global.js';
import UserModel from '../models/users.js'
import bcrypt from 'bcrypt';
import token from '../utils/index.js';

const userController = {
    getAllUser: async (req, res) => {
        const users = await UserModel.find({});
        res.status(200).send({
            data: users,
            message: 'Thành công!',
            success: true
        });
    },
    create: async (req, res) => {
        try {
            const data = req.body;
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(data.password, salt);
            const createdUser = await UserModel.create({
                ...data,
                password: hash,
                salt: salt
            });
            res.status(201).send({
                data: createdUser
            });
        } catch (error) {
            res.status(403).send({
                message: error.message
            });
        }
    },
    login: async(req,res) => {
        try {
            const data = req.body;

            const crrUser = await UserModel.findOne({
                email: data.email,
            }).lean()

            if(!crrUser) {
                throw new Error("Sai tài khoản hoặc mật khẩu")
            }
           

            if(bcrypt.hashSync(data.password, crrUser.salt) !== crrUser.password) {
                throw new Error("Sai tài khoản hoặc mật khẩu")
            }
            
            const dataResponse = {
                ...crrUser
            }
            console.log(dataResponse)
            delete dataResponse.password;
            delete dataResponse.salt;

            const tk = token.generateToken({
                email: crrUser.email,
                _id: crrUser._id
            })
            res.status(200).send({
                data: tk
            })

        } catch (error) {
            res.status(403).send({
                message:error.message
            })
        }
    },
    profile: async(req,res) => {
        try {
            const {id} = req.params;
            const crrUser = await UserModel.findById(id);
            if(!crrUser) {
                throw new Error('Không tồn tại thông tin người dùng')
              }
              res.status(200).send({
                data: crrUser,
                message:'Thành công'
        })
        } catch (error) {
            res.status(401).send({
                message: error.message ?? 'Không thể truy vấn thông tin người dùng',
                data: null
            })
        }
    },
    editProfile: async(req,res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            if(req.dataToken._id !== id) {
                throw new Error()
            }
            const updatedUser = await UserModel.findByIdAndUpdate(id, {
                $set: data
            }, { new: true });            
            res.status(200).send({
                data: updatedUser,
                message: 'Thông tin người dùng đã được cập nhật thành công',
                success: true
            })
        } catch (error) {
            res.status(403).send({
                message: error.message ?? 'Không có quyền chỉnh sửa thông tin người dùng',
                data:null
            })
        }
    },
    logout: async(req,res) => {
        try {
            res.status(200).send({
                message:'Đăng xuất thành công'
            })
        } catch (error) {
            res.status(500).send({
                message: error.message ?? 'Lỗi trong quá trình đăng xuất'
            })
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { email, password, confirmNewPassword, newPassword, verifyCode } = req.body;
            const crrUser = await UserModel.findOne({ email }).lean();
            if (!crrUser) throw {
                message: 'Không tồn tại người dùng!'
            }
            if (verifyCode) {
                const checked = verifyCodes.findIndex((item) => {
                    return item.email === email && verifyCode === item.code;
                });
                if (checked < 0) throw {
                    message: 'Mã xác thực không hợp lệ!'
                }
              
                verifyCodes.splice(checked, 1);
            } else if (bcrypt.hashSync(password, crrUser.salt) !== crrUser.password) {
                throw {
                    message: 'Mật khẩu cũ không khớp!'
                }
            }
            if (confirmNewPassword !== newPassword) throw {
                message: 'Mật khẩu mới chưa khớp!'
            }
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(newPassword, salt);
            crrUser.salt = salt;
            crrUser.password = hash;

            await crrUser.save();
            res.status(201).send({
                message: 'Cập nhật mật khẩu thành công!',
            });
        } catch (error) {
            res.status(401).send({
                message: error.message
            });
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.query;
            if (!email) throw {
                message: 'Chưa có thông tin email!'
            }
            const existedUser = await UserModel.findOne({ email }).lean();
            if (!existedUser) throw {
                message: 'Không tồn tại thông tin người dùng!'
            }
            const newCode = {
                email: email,
                code: Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000,
                createdAt: new Date()
            }
            verifyCodes.push(newCode);
            res.status(200).send({
                data: newCode.code,
                message: 'Thời gian sử dụng mã là 3 phút!'
            });
        } catch (error) {
            res.status(401).send({
                message: error.message
            });
        }
    },

}

export default userController