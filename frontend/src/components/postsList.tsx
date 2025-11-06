import React from 'react';
import { Link } from 'react-router-dom';
import arrow from '../../assets/arrow.svg';

export type Vote = {
  id: number;
  postId: number;
  voteType: 'Upvote' | 'Downvote';
};

export type Comment = {
  id: number;
  content: string;
};

export type Post = {
  id: number;
  title: string;
  dateCreated: string;
  memberPostedBy: {
    user: {
      username: string;
    };
  };
  comments: Comment[];
  votes: Vote[];
};

interface PostsListProps {
  posts: Post[];
}

function computeVoteCount(votes: Vote[]): number {
  let count = 0;
  votes.forEach((v) => (v.voteType === 'Upvote' ? count++ : count--));
  return count;
}

export const PostsList: React.FC<PostsListProps> = ({ posts }) => (
  <div className="posts-list">
    {posts.map((post) => (
      <div className="post-item" key={post.id}>
        <div className="post-item-votes">
          <div className="post-item-upvote">
            <img src={arrow} alt="Upvote" />
          </div>
          <div>{computeVoteCount(post.votes)}</div>
          <div className="post-item-downvote">
            <img src={arrow} alt="Downvote" />
          </div>
        </div>
        <div className="post-item-content">
          <div className="post-item-title">{post.title}</div>
          <div className="post-item-details">
            <div>{new Date(post.dateCreated).toLocaleDateString()}</div>
            <Link to={`/member/${post.memberPostedBy.user.username}`}>
              by {post.memberPostedBy.user.username}
            </Link>
            <div>
              {post.comments.length}{' '}
              {post.comments.length !== 1 ? 'comments' : 'comment'}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

