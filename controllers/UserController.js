import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js'


export const register = async (req,res) => {
    try {
    

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);

    const doc = new UserModel( {
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash : hash,
        isModerator: false,
    });

    const user = await doc.save();
    const token = jwt.sign({
        _id: user._id,
    }, 'cipher',
    {
        expiresIn: '30d',
        },
    );

    const { passwordHash, ...userData} = user._doc;

    res.json( {
        ...userData,
        token
    });
    } catch (err) {
        console.log(err);
        res.status(500).json( {
            message: 'Ошибка во время регистрации'
        });
    }
};

export const login = async (req,res)=> {
    try {
        const user = await UserModel.findOne( { email: req.body.email});
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }
    
        const isValidPass = await bcrypt.compare(req.body.password,user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль',
            });
        }
    
        const token = jwt.sign(
            {
                _id: user._id,
            },
            'cipher',
            {
                expiresIn:'30d',
            },
        );
    
        const { passwordHash, ...userData} = user._doc;
    
        res.json( {
            ...userData,
            token
        });
    
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message:'Произошла неизвестная ошибка',
        });
    }
};

export const getMe = async (req,res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if(!user) {
            return res.status(404).json({
                message:'Пользователь не найден',
            });
        }
        const { passwordHash, ...userData} = user._doc;

    res.json( {
        ...userData
    });
    } catch (err) {
        console.log(err);
        res.status(500).json( {
            message: 'Нет доступа'
        });
    }
};

export const updateOne = async (req,res) => {
    try {
        const userId = req.params.id;

        await UserModel.updateOne({
            _id: userId,
        }, 
        {   
            fullName: req.body.fullName?req.body.fullName:fullName,
            email: req.body.email?req.body.email:email,
            avatarUrl: req.body.avatarUrl?req.body.avatarUrl:""
        },
    );
    res.json({
        success:true,
    });
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось изменить профиль',
        });
    }
}

export const getOne = async (req,res) => {
        const userId = req.params.id;
        try {
            const user = await UserModel.findById(userId);
            if(!user) {
                return res.status(404).json({
                    message:'Пользователь не найден',
                });
            }
            const { passwordHash, ...userData} = user._doc;
    
        res.json( {
            ...userData
        });
        } catch (err) {
            console.log(err);
            res.status(500).json( {
                message: 'Нет доступа'
            });
        }
}

export const removeOne = async (req, res) => {
    try {
      const userId = req.params.id;
      UserModel.findByIdAndRemove({
        _id: userId,
      },
      (err,doc)=> {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message:'Не удалось получить пользователя',
            });
        }
        if (!doc) {
            return res.status(404).json({
                message:'Пользователь не найден',
            });
        }
        res.json( {
            success:true,
        });
      },
    );
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить пользователя',
      });
    }
  };