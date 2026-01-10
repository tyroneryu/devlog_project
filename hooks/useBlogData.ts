import { useState, useEffect } from 'react';
import { Post } from '../types';

// Use relative path via proxy
const API_BASE = '';

// Fallback data in case server is offline
const FALLBACK_POSTS: Post[] = [];

export const useBlogData = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/posts`);
        if (!response.ok) {
          throw new Error('Server offline');
        }
        const data = await response.json();
        setPosts(data);
        setError(null);
      } catch (err) {
        console.warn("Backend server unreachable. Using fallback/empty state. Run 'npm run server'.");
        setPosts(FALLBACK_POSTS);
        setError("Could not connect to backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
};

export const useSinglePost = (id: string | undefined) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/posts/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return { post, loading };
};