import React from "react";

const Post = ({ post }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold">{post.authorName}</h2>
      <p className="mt-2">{post.content}</p>
      <div className="mt-4 flex gap-4 text-sm text-gray-500">
        <button>Like ({post.likes.length})</button>
        <button>Comment</button>
        <button>Share</button>
      </div>
    </div>
  );
};

export default Post;
