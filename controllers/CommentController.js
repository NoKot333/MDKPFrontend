import CommentModel from "../models/Comments.js"
import PostModel from "../models/Post.js"

export const create = async (req,res) => {
    try {
        const {postId,comment} = req.body
        const userId = req.userId;
        
        if(!comment)
            return res.json({message: "Комментарий не может быть пустым"})
        
        const newComment = new CommentModel({text:comment,user:userId})
        await newComment.save()
        try {
            await PostModel.findByIdAndUpdate(postId, {
                $push:{comments: newComment._id},
            })
        } catch (error) {
            console.log(error)
        }

        res.json(newComment)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Что-то пошло не так."})
    }
};
export const remove = async (req,res) => {
    try {
    const commentId = req.params.id;
    CommentModel.findByIdAndRemove({
      _id: commentId,
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