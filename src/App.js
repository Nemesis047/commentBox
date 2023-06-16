import React, { useState, useEffect } from 'react';
import './App.css'
const CommentBox = () => {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [replyInput, setReplyInput] = useState('');

  useEffect(() => {
    const storedComments = localStorage.getItem('comments');
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, []);

  useEffect(() => {
   if(comments.length>0){ localStorage.setItem('comments', JSON.stringify(comments))};
  }, [comments]);

  const handleCommentChange = (e) => {
    setCommentInput(e.target.value);
  };

  const handleReplyChange = (e) => {
    setReplyInput(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentInput.trim() === '') return;
    const newComment = {
      text: commentInput,
      replies: [],
    };
    setComments([...comments, newComment]);
    setCommentInput('');
  };

  const handleEditComment = (index) => {
    setEditIndex(index);
  };

  const handleSaveEdit = (index, newText) => {
    const updatedComments = [...comments];
    updatedComments[index].text = newText;
    setComments(updatedComments);
    setEditIndex(null);
  };

  const handleReplySubmit = (index) => {
    const updatedComments = [...comments];
    const newReply = { text: replyInput };
    updatedComments[index].replies.push(newReply);
    setComments(updatedComments);
    setReplyInput('');
  };

  const renderReplies = (replies) => {
    return replies.map((reply, index) => (
      <div
        key={index}
        style={{ marginLeft: '20px', marginTop: '10px' }}
      >
        {reply.text}
      </div>
    ));
  };

  return (
    <div>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={commentInput}
          onChange={handleCommentChange}
          placeholder="Enter your comment"
        />
        <button type="submit">Add Comment</button>
      </form>

      {comments.map((comment, index) => (
        <div key={index}>
          {index === editIndex ? (
            <div>
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button
                onClick={() => handleSaveEdit(index, commentInput)}
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              <div>{comment.text}</div>
              <button onClick={() => handleEditComment(index)}>
                Edit
              </button>
              <button onClick={() => handleReplySubmit(index)}>
                Reply
              </button>
              {renderReplies(comment.replies)}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleReplySubmit(index);
                }}
                style={{ marginLeft: '20px' }}
              >
                <input
                  type="text"
                  value={replyInput}
                  onChange={handleReplyChange}
                  placeholder="Enter your reply"
                />
                <button type="submit">Add Reply</button>
              </form>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentBox;
