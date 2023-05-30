import PostModel from '../models/Post.js';
import Comments from '../models/Comments.js';

export const hello = async (req,res) => {
  try {
    return res.status(200).json({
      status: 'work'
    })
  } catch {
    res.status(500).json({
      status: 'SOMETHING WENT WRONG'
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось вернуть статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json(doc);
      },
    ).populate('user');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getAll = async (req,res) => {
  try {
      const posts = await PostModel.find().sort({"createdAt":-1}).populate( {path:'user',select:["fullName","email","avatarUrl"]}).exec();

      res.json(posts);
  } catch (err) {
      console.log(err);
      res.status(500).json({
          message: 'Не удалось получить статьи',
      });
  }
};

export const getPostTags = async (req,res) => {
  try {
      const posts = await await PostModel.find({tags:{$elemMatch:{$eq:req.params.tag}}}).sort({"createdAt":-1}).populate( {path:'user',select:["fullName","email","avatarUrl"]}).exec();

      res.json(posts);
  } catch (err) {
      console.log(err);
      res.status(500).json({
          message: 'Не удалось получить статьи',
      });
  }
};

export const getAllPopular = async (req,res) => {
  try {
      const posts = await PostModel.find().sort({"viewsCount":-1}).populate( {path:'user',select:["fullName","email","avatarUrl"]}).exec();

      res.json(posts);
  } catch (err) {
      console.log(err);
      res.status(500).json({
          message: 'Не удалось получить статьи',
      });
  }
};

export const removeOne = async (req, res) => {
    try {
      const postId = req.params.id;
      PostModel.findByIdAndRemove({
        _id: postId,
      },
      (err,doc)=> {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message:'Не удалось получить статью',
            });
        }
        if (!doc) {
            return res.status(404).json({
                message:'Статья не найдена',
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
        message: 'Не удалось получить статьи',
      });
    }
};

export const updateOne = async (req,res) => {
  try {
      const postId = req.params.id;

      await PostModel.updateOne({
          _id: postId,
      }, 
      {
          title:req.body.title,
          text: req.body.text,
          imageUrl: req.body.imageUrl,
          user: req.userId,
          tags: req.body.tags.split(','),
      },
  );
  res.json({
      success:true,
  });
  } catch (err) {
      console.log(err);
      res.status(500).json({
          message: 'Не удалось изменить статью',
      });
  }
}

export const create = async (req,res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(',').map(element => {
              return element.trim();
            }),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось добавить пост',
        })

    }
};

export const getLastTags = async (req,res) => {
  try {
      const posts = await PostModel.find().limit(5).exec();

    const tags = posts.map(obj=>obj.tags).flat().reverse().slice(1,6);

      res.json(tags);
  } catch (err) {
      console.log(err);
      res.status(500).json({
          message: 'Не удалось получить тэги',
      });
  }
};

export const getUserPost = async (req,res) => {
  try {
      const posts = await await PostModel.find({'user':{$eq:req.params.id}}).sort({"createdAt":-1}).populate( {path:'user',select:["avatarUrl","isModerator","fullName","email"]}).exec();
      res.json(posts);
      console.log(req.params.id);
  } catch (err) {
      console.log(err);
      res.status(500).json({
          message: 'Не удалось получить статьи',
      });
  }
};

export const getPostComments = async (req,res) => {
  try {
    const post = await PostModel.findById(req.params.id).sort({"createdAt":-1}).populate( {path:'user',select:["fullName","email","avatarUrl"]}).exec();
    console.log(post)
    const list = await Promise.all(
      post.comments.map((comment)=> {
        return Comments.findById(comment).populate( {path:'user',select:["fullName","email","avatarUrl"]}).exec();
      })
    )
    res.json(list)
  } catch (error) {
    console.log(error)
    res.status(500).json({message:'Что-то пошло не так'})
  }
}