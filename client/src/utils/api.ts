const API_BASE = "http://localhost:3000/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("authToken");

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE}${url}`, config);

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
      throw new ApiError(401, "Unauthorized");
    }

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new ApiError(
        response.status,
        errorData.message || "Request failed"
      );
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or other errors
    throw new ApiError(0, "Network error. Please check your connection.");
  }
}

export const api = {
  // Auth endpoints
  register: async (userData: {
    email: string;
    username: string;
    password: string;
  }) => {
    const response = await authenticatedFetch("/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await authenticatedFetch("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  // Profile endpoints
  getProfile: async () => {
    const response = await authenticatedFetch("/profile");
    return response.json();
  },

  updateProfile: async (
    profileData: Partial<{
      username: string;
      phone: string;
      bio: string;
      avatarUrl: string;
      isPrivate: boolean;
    }>
  ) => {
    const response = await authenticatedFetch("/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
    return response.json();
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await authenticatedFetch("/password", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    });
    return response.json();
  },

  // Post endpoints
  createPost: async (postData: { caption?: string; mediaUrl?: string }) => {
    const response = await authenticatedFetch("/posts", {
      method: "POST",
      body: JSON.stringify(postData),
    });
    return response.json();
  },

  updatePost: async (
    postId: number,
    postData: { caption?: string; mediaUrl?: string }
  ) => {
    const response = await authenticatedFetch(`/${postId}`, {
      method: "PUT",
      body: JSON.stringify(postData),
    });
    return response.json();
  },

  deletePost: async (postId: number) => {
    await authenticatedFetch(`/${postId}`, {
      method: "DELETE",
    });
  },

  // Comment endpoints
  getComments: async (postId: number) => {
    const response = await authenticatedFetch(`/${postId}/comments`);
    return response.json();
  },

  createComment: async (postId: number, comment: string) => {
    const response = await authenticatedFetch(`/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ comment }),
    });
    return response.json();
  },

  updateComment: async (commentId: number, comment: string) => {
    const response = await authenticatedFetch(`/${commentId}`, {
      method: "PUT",
      body: JSON.stringify({ comment }),
    });
    return response.json();
  },

  deleteComment: async (commentId: number) => {
    const response = await authenticatedFetch(`/${commentId}`, {
      method: "DELETE",
    });
    return response.json();
  },

  // Like endpoints
  likePost: async (postId: number) => {
    const response = await authenticatedFetch(`/${postId}/likes`, {
      method: "POST",
    });
    return response.json();
  },

  unlikePost: async (postId: number) => {
    await authenticatedFetch(`/${postId}/likes`, {
      method: "DELETE",
    });
  },

  getLikeCount: async (postId: number) => {
    const response = await authenticatedFetch(`/${postId}/likes`);
    return response.json();
  },

  // Social endpoints
  followUser: async (username: string) => {
    const response = await authenticatedFetch(`/${username}/follow`, {
      method: "POST",
    });
    return response.json();
  },

  unfollowUser: async (username: string) => {
    const response = await authenticatedFetch(`/${username}/unfollow`, {
      method: "DELETE",
    });
    return response.json();
  },

  getFollowers: async () => {
    const response = await authenticatedFetch("/followers");
    return response.json();
  },

  getFollowing: async () => {
    const response = await authenticatedFetch("/following");
    return response.json();
  },

  // Search endpoints
  searchUsers: async (username: string) => {
    const response = await authenticatedFetch(
      `/search?username=${encodeURIComponent(username)}`
    );
    return response.json();
  },
};
