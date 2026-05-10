const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export const API_ROOT_URL = API_BASE_URL.startsWith("/")
  ? (typeof window !== "undefined" ? window.location.origin : "")
  : API_BASE_URL.replace(/\/api\/v1\/?$/, "");
const TOKEN_KEY = "better_media_access_token";

const REFRESH_TOKEN_KEY = "better_media_refresh_token";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  plan: "FREE" | "PRO";
}

export interface UserSummary {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  plan?: "FREE" | "PRO";
}

export interface Post {
  id: string;
  authorId?: string;
  content: string;
  imageUrl?: string | null;
  visibility?: "PUBLIC" | "PRIVATE";
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  author?: User;
  likes?: string[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  postId?: string;
  parentId?: string | null;
  content: string;
  likesCount: number;
  repliesCount: number;
  createdAt: string;
  author?: UserSummary;
}

export interface Follower {
  id: string;
  followedAt: string;
  follower?: UserSummary;
  user?: UserSummary;
}

interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  limit: number;
  offset: number;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedUser?: UserSummary | null;
  relatedPost?: { id: string; content: string } | null;
}

interface BlocksResponse {
  blocked: BlockedUser[];
  total: number;
  limit: number;
  offset: number;
}

export interface BlockedUser {
  id: string;
  blockedAt: string;
  user: UserSummary;
}

type RawBlockedUser =
  | BlockedUser
  | (UserSummary & { blockedAt?: string; createdAt?: string });

export interface BillingStatus {
  id: string;
  email: string;
  plan: "FREE" | "PRO";
  planStatus: string | null;
  planStartedAt: string | null;
  stripeCurrentPeriodEndAt: string | null;
  stripeSubscriptionId: string | null;
}

interface CommentsResponse {
  comments: Comment[];
  total: number;
  limit: number;
  offset: number;
}

interface UserPostsResponse {
  posts: Post[];
  total: number;
  limit: number;
  offset: number;
}

interface SearchUsersResponse {
  results: User[];
  total: number;
  limit: number;
  offset: number;
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 && token) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const envelope = await refreshResponse.json();
          const data: AuthResponse = envelope.data ?? envelope;
          setTokens(data.accessToken, data.refreshToken);

          headers["Authorization"] = `Bearer ${data.accessToken}`;
          return apiRequest<T>(endpoint, { ...options, headers });
        } else {
          clearTokens();
          if (typeof window !== "undefined" && window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          throw new Error("Session expired");
        }
      } catch (error) {
        clearTokens();
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        throw error;
      }
    } else {
      clearTokens();
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      throw new Error("No refresh token available");
    }
  }

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : typeof errorData.error === "object"
            ? JSON.stringify(errorData.error)
            : errorData.message || String(errorData.error);
    } catch {
      errorMessage = `API Error: ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204 || response.status === 205) {
    return undefined as T;
  }

  const contentLength = response.headers.get("content-length");
  if (contentLength === "0") {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const json = await response.json();
    if (json && typeof json === "object" && "success" in json && "data" in json) {
      if (!json.success) {
        throw new Error(json.error || "Request failed");
      }
      return json.data as T;
    }
    return json as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return text as T;
}

export const authAPI = {
  register: async (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<void> => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await apiRequest("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      }
    } finally {
      clearTokens();
    }
  },
};

export const usersAPI = {
  getProfile: async (userId: string): Promise<User> => {
    return apiRequest(`/users/${userId}`);
  },

  getUserPosts: async (
    userId: string,
    limit = 10,
    offset = 0,
  ): Promise<UserPostsResponse> => {
    return apiRequest(`/users/${userId}/posts?limit=${limit}&offset=${offset}`);
  },

  getCurrentProfile: async (): Promise<User> => {
    return apiRequest("/users/me");
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    return apiRequest("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  search: async (
    query: string,
    limit = 10,
    offset = 0,
  ): Promise<SearchUsersResponse> => {
    return apiRequest(
      `/users/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`,
    );
  },
};

export const postsAPI = {
  create: async (
    content: string,
    image?: File | null,
    visibility?: "PUBLIC" | "PRIVATE",
  ): Promise<Post> => {
    const body = new FormData();
    const trimmedContent = content.trim();
    if (trimmedContent) {
      body.append("content", trimmedContent);
    }
    if (image) {
      body.append("image", image);
    }
    if (visibility) {
      body.append("visibility", visibility);
    }
    return apiRequest("/posts", {
      method: "POST",
      body,
    });
  },

  updatePost: async (
    postId: string,
    content: string,
    visibility?: "PUBLIC" | "PRIVATE",
  ): Promise<Post> => {
    return apiRequest(`/posts/${postId}`, {
      method: "PATCH",
      body: JSON.stringify({ content, visibility }),
    });
  },

  deletePost: async (postId: string): Promise<void> => {
    return apiRequest(`/posts/${postId}`, { method: "DELETE" });
  },

  getFeed: async (limit = 20, offset = 0): Promise<Post[]> => {
    return apiRequest(`/posts?limit=${limit}&offset=${offset}`);
  },

  getForYouFeed: async (limit = 20, offset = 0): Promise<Post[]> => {
    return apiRequest(`/posts/for-you?limit=${limit}&offset=${offset}`);
  },
};

export const likesAPI = {
  likePost: async (
    postId: string,
  ): Promise<{
    id: string;
    userId: string;
    postId: string;
    createdAt: string;
    message: string;
  }> => {
    return apiRequest(`/posts/${postId}/likes`, {
      method: "POST",
    });
  },

  unlikePost: async (postId: string): Promise<void> => {
    return apiRequest(`/posts/${postId}/likes`, { method: "DELETE" });
  },
};

export const commentsAPI = {
  createComment: async (
    postId: string,
    content: string,
    parentId?: string | null,
  ): Promise<Comment> => {
    const payload: { postId: string; content: string; parentId?: string } = {
      postId,
      content,
    };
    if (parentId) {
      payload.parentId = parentId;
    }
    return apiRequest(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getPostComments: async (
    postId: string,
    options?: { limit?: number; offset?: number; parentId?: string | null },
  ): Promise<CommentsResponse> => {
    const params = new URLSearchParams();
    if (options?.limit !== undefined) {
      params.set("limit", String(options.limit));
    }
    if (options?.offset !== undefined) {
      params.set("offset", String(options.offset));
    }
    if (options?.parentId) {
      params.set("parentId", options.parentId);
    }
    const query = params.toString();
    return apiRequest(`/posts/${postId}/comments${query ? `?${query}` : ""}`);
  },

  updateComment: async (
    postId: string,
    commentId: string,
    content: string,
  ): Promise<Comment> => {
    return apiRequest(`/posts/${postId}/comments/${commentId}`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    });
  },

  deleteComment: async (
    postId: string,
    commentId: string,
  ): Promise<{ message: string; deletedCount: number }> => {
    return apiRequest(`/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
    });
  },

  likeComment: async (
    postId: string,
    commentId: string,
  ): Promise<{
    id: string;
    userId: string;
    commentId: string;
    createdAt: string;
    message: string;
  }> => {
    return apiRequest(`/posts/${postId}/comments/${commentId}/likes`, {
      method: "POST",
    });
  },

  unlikeComment: async (postId: string, commentId: string): Promise<void> => {
    return apiRequest(`/posts/${postId}/comments/${commentId}/likes`, {
      method: "DELETE",
    });
  },
};

export const followsAPI = {
  followUser: async (
    _currentUserId: string,
    targetUserId: string,
  ): Promise<Follower> => {
    return apiRequest(`/users/${targetUserId}/follow`, {
      method: "POST",
    });
  },

  unfollowUser: async (userId: string, followingId: string): Promise<void> => {
    return apiRequest(`/users/${userId}/follow/${followingId}`, {
      method: "DELETE",
    });
  },

  getUserFollowers: async (userId: string): Promise<Follower[]> => {
    return apiRequest(`/users/${userId}/followers`);
  },

  getUserFollowing: async (userId: string): Promise<Follower[]> => {
    return apiRequest(`/users/${userId}/following`);
  },
};

export const notificationsAPI = {
  list: async (limit = 20, offset = 0): Promise<NotificationsResponse> => {
    return apiRequest(`/notifications?limit=${limit}&offset=${offset}`);
  },

  markRead: async (
    notificationId: string,
    read = true,
  ): Promise<Notification> => {
    return apiRequest(`/notifications/${notificationId}`, {
      method: "PATCH",
      body: JSON.stringify({ read }),
    });
  },

  remove: async (notificationId: string): Promise<void> => {
    return apiRequest(`/notifications/${notificationId}`, {
      method: "DELETE",
    });
  },
};

export const blocksAPI = {
  list: async (limit = 20, offset = 0): Promise<BlocksResponse> => {
    const response = await apiRequest<
      | BlocksResponse
      | RawBlockedUser[]
      | {
          blocked: RawBlockedUser[];
          total?: number;
          limit?: number;
          offset?: number;
        }
    >(`/blocks?limit=${limit}&offset=${offset}`);

    const rawBlocked = Array.isArray(response)
      ? response
      : Array.isArray(response?.blocked)
        ? response.blocked
        : [];

    const blocked: BlockedUser[] = rawBlocked
      .map((entry) => {
        if (
          entry &&
          typeof entry === "object" &&
          "user" in entry &&
          entry.user
        ) {
          return {
            id: entry.id,
            blockedAt: entry.blockedAt,
            user: entry.user,
          } as BlockedUser;
        }

        if (
          entry &&
          typeof entry === "object" &&
          "id" in entry &&
          "username" in entry &&
          "firstName" in entry &&
          "lastName" in entry
        ) {
          const userSummary = entry as UserSummary & {
            blockedAt?: string;
            createdAt?: string;
          };
          return {
            id: userSummary.id,
            blockedAt:
              userSummary.blockedAt ||
              userSummary.createdAt ||
              new Date(0).toISOString(),
            user: {
              id: userSummary.id,
              username: userSummary.username,
              firstName: userSummary.firstName,
              lastName: userSummary.lastName,
              plan: userSummary.plan,
            },
          };
        }

        return null;
      })
      .filter((entry): entry is BlockedUser => entry !== null);

    return {
      blocked,
      total: Array.isArray(response)
        ? blocked.length
        : typeof response?.total === "number"
          ? response.total
          : blocked.length,
      limit: Array.isArray(response)
        ? limit
        : typeof response?.limit === "number"
          ? response.limit
          : limit,
      offset: Array.isArray(response)
        ? offset
        : typeof response?.offset === "number"
          ? response.offset
          : offset,
    };
  },

  checkBlockStatus: async (userId: string): Promise<{
    isBlocked: boolean;
    blockedByMe: boolean;
    blockedByThem: boolean;
  }> => {
    return apiRequest(`/blocks/check/${userId}`);
  },

  blockUser: async (username: string): Promise<BlockedUser> => {
    return apiRequest(`/blocks`, {
      method: "POST",
      body: JSON.stringify({ username }),
    });
  },

  unblockUser: async (username: string): Promise<void> => {
    return apiRequest(`/blocks`, {
      method: "DELETE",
      body: JSON.stringify({ username }),
    });
  },
};

export const billingAPI = {
  getStatus: async (): Promise<BillingStatus> => {
    return apiRequest("/billing/me");
  },

  createCheckoutSession: async (): Promise<{ url: string }> => {
    return apiRequest("/billing/create-checkout-session", { method: "POST" });
  },

  createPaymentIntent: async (): Promise<{ clientSecret: string }> => {
    return apiRequest("/billing/create-payment-intent", { method: "POST" });
  },

  confirmPayment: async (
    sessionId?: string,
    paymentIntentId?: string,
  ): Promise<{
    paymentStatus: string;
    amount: number;
    currency: string;
    plan: string;
  }> => {
    const params = new URLSearchParams();
    if (sessionId) params.append("session_id", sessionId);
    if (paymentIntentId) params.append("payment_intent_id", paymentIntentId);
    return apiRequest(`/billing/confirm?${params.toString()}`);
  },

  downgrade: async (): Promise<{
    id: string;
    email: string;
    plan: string;
    planStatus: string | null;
  }> => {
    return apiRequest("/billing/downgrade", { method: "POST" });
  },
};

export { getAccessToken, setTokens, clearTokens };
