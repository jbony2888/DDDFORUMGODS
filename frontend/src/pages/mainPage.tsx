import React from 'react';
import { Layout } from '../components/layout';
import { PostsList } from '../components/postsList';
import type { Post } from '../components/postsList';
import { PostsViewSwitcher } from '../components/postsViewSwitcher';

// Dummy data for now
const dummyPosts: Post[] = [
  {
    id: 1,
    title: 'First Post',
    dateCreated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    memberPostedBy: {
      user: {
        username: 'username',
      },
    },
    comments: [{ id: 1, content: 'Comment 1' }],
    votes: [
      { id: 1, postId: 1, voteType: 'Upvote' },
      { id: 2, postId: 1, voteType: 'Upvote' },
      { id: 3, postId: 1, voteType: 'Upvote' },
      { id: 4, postId: 1, voteType: 'Upvote' },
      { id: 5, postId: 1, voteType: 'Upvote' },
    ],
  },
  {
    id: 2,
    title: 'Second Post!',
    dateCreated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    memberPostedBy: {
      user: {
        username: 'username',
      },
    },
    comments: [
      { id: 1, content: 'Comment 1' },
      { id: 2, content: 'Comment 2' },
      { id: 3, content: 'Comment 3' },
    ],
    votes: [
      { id: 1, postId: 2, voteType: 'Upvote' },
      { id: 2, postId: 2, voteType: 'Upvote' },
    ],
  },
  {
    id: 3,
    title: 'Why DDD?',
    dateCreated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    memberPostedBy: {
      user: {
        username: 'username',
      },
    },
    comments: [
      { id: 1, content: 'Comment 1' },
      { id: 2, content: 'Comment 2' },
      { id: 3, content: 'Comment 3' },
    ],
    votes: [
      { id: 1, postId: 3, voteType: 'Upvote' },
      { id: 2, postId: 3, voteType: 'Upvote' },
      { id: 3, postId: 3, voteType: 'Upvote' },
      { id: 4, postId: 3, voteType: 'Upvote' },
      { id: 5, postId: 3, voteType: 'Upvote' },
      { id: 6, postId: 3, voteType: 'Upvote' },
      { id: 7, postId: 3, voteType: 'Upvote' },
    ],
  },
];

export const MainPage: React.FC = () => {
  return (
    <Layout>
      <PostsViewSwitcher />
      <PostsList posts={dummyPosts} />
    </Layout>
  );
};

