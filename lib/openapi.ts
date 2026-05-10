export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Better Media API",
    version: "1.0.0",
    description:
      "REST API for the Better Media social media platform. All API endpoints are prefixed with `/api/v1`.\n\nAuthentication is done via Bearer JWT tokens. Obtain tokens through the auth endpoints.",
  },
  servers: [
    {
      url: "/api/v1",
      description: "API v1 (same-origin)",
    },
    {
      url: "http://localhost:3000/api/v1",
      description: "Local development",
    },
  ],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user account",
        operationId: "registerUser",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Account created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_AuthResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "409": {
            description: "Email or username already taken",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Log in with email and password",
        operationId: "loginUser",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_AuthResponse" },
              },
            },
          },
          "401": {
            description: "Invalid email or password",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Authentication"],
        summary: "Log out and revoke refresh token",
        operationId: "logoutUser",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefreshTokenInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Logged out successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_MessageResponse" },
              },
            },
          },
          "401": {
            description: "Invalid refresh token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/refresh": {
      post: {
        tags: ["Authentication"],
        summary: "Refresh access and refresh tokens",
        operationId: "refreshTokens",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefreshTokenInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "New tokens issued",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_AuthResponse" },
              },
            },
          },
          "401": {
            description: "Invalid or expired refresh token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/posts": {
      get: {
        tags: ["Posts"],
        summary: "Get following feed (paginated)",
        operationId: "getFeed",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
            description: "Number of posts to return",
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "integer", default: 0 },
            description: "Number of posts to skip",
          },
        ],
        responses: {
          "200": {
            description: "Feed posts",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_PostArray" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Posts"],
        summary: "Create a new post",
        operationId: "createPost",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/CreatePostInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Post created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_Post" },
              },
            },
          },
          "400": {
            description: "Validation error or content exceeds plan limit",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/posts/feed": {
      get: {
        tags: ["Posts"],
        summary: "Alias for GET /posts - following feed",
        operationId: "getFeedAlias",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "integer", default: 0 },
          },
        ],
        responses: {
          "200": {
            description: "Feed posts",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_PostArray" },
              },
            },
          },
        },
      },
    },
    "/posts/for-you": {
      get: {
        tags: ["Posts"],
        summary: "Get For You feed (2nd-degree connections)",
        operationId: "getForYouFeed",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "integer", default: 0 },
          },
        ],
        responses: {
          "200": {
            description: "For You posts",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_PostArray" },
              },
            },
          },
        },
      },
    },
    "/posts/{postId}": {
      get: {
        tags: ["Posts"],
        summary: "Get a single post by ID",
        operationId: "getPostById",
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Post details with likes and comments",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_PostWithDetails" },
              },
            },
          },
          "403": {
            description: "Post is private",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Posts"],
        summary: "Update a post",
        operationId: "updatePost",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePostInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Post updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_Post" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "403": {
            description: "Cannot update another user's post",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Posts"],
        summary: "Delete a post",
        operationId: "deletePost",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Post deleted",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_MessageResponse" },
              },
            },
          },
          "403": {
            description: "Cannot delete another user's post",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/posts/{postId}/likes": {
      post: {
        tags: ["Post Likes"],
        summary: "Like a post",
        operationId: "likePost",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "201": {
            description: "Post liked",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_LikeResponse" },
              },
            },
          },
          "400": {
            description: "Post already liked",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Post Likes"],
        summary: "Unlike a post",
        operationId: "unlikePost",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Unliked successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_MessageResponse" },
              },
            },
          },
          "404": {
            description: "Like or post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      get: {
        tags: ["Post Likes"],
        summary: "Get users who liked a post",
        operationId: "getPostLikes",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "integer", default: 0 },
          },
        ],
        responses: {
          "200": {
            description: "Likes list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_LikesListResponse" },
              },
            },
          },
        },
      },
    },
    "/posts/{postId}/comments": {
      post: {
        tags: ["Comments"],
        summary: "Create a comment or reply",
        operationId: "createComment",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCommentInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Comment created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_Comment" },
              },
            },
          },
          "404": {
            description: "Post or parent comment not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      get: {
        tags: ["Comments"],
        summary: "Get comments for a post (paginated)",
        operationId: "getComments",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 5 },
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "integer", default: 0 },
          },
          {
            name: "parentId",
            in: "query",
            schema: { type: "string", format: "uuid", nullable: true },
            description: "Filter by parent comment (for replies). Omit for top-level comments.",
          },
        ],
        responses: {
          "200": {
            description: "Comments list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_CommentsResponse" },
              },
            },
          },
        },
      },
    },
    "/posts/{postId}/comments/{commentId}": {
      patch: {
        tags: ["Comments"],
        summary: "Update a comment",
        operationId: "updateComment",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["content"],
                properties: {
                  content: {
                    type: "string",
                    minLength: 1,
                    maxLength: 500,
                    description: "Updated comment text",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Comment updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_Comment" },
              },
            },
          },
          "403": {
            description: "Cannot update another user's comment",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Comment not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Comments"],
        summary: "Delete a comment and its replies",
        operationId: "deleteComment",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Comment deleted",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_DeleteCommentResponse" },
              },
            },
          },
          "403": {
            description: "Cannot delete another user's comment",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Comment not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/posts/{postId}/comments/{commentId}/likes": {
      post: {
        tags: ["Comment Likes"],
        summary: "Like a comment",
        operationId: "likeComment",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "201": {
            description: "Comment liked",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_CommentLikeResponse" },
              },
            },
          },
          "400": {
            description: "Comment already liked",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Comment not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Comment Likes"],
        summary: "Unlike a comment",
        operationId: "unlikeComment",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Comment unliked",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_MessageResponse" },
              },
            },
          },
          "404": {
            description: "Like or comment not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get current user profile",
        operationId: "getCurrentProfile",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Current user profile",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_User" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Users"],
        summary: "Update current user profile",
        operationId: "updateProfile",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: { type: "string", minLength: 1 },
                  lastName: { type: "string", minLength: 1 },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Profile updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_User" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/users/search": {
      get: {
        tags: ["Users"],
        summary: "Search users by name or username",
        operationId: "searchUsers",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Search query",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "integer", default: 0 },
          },
        ],
        responses: {
          "200": {
            description: "Search results",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_SearchUsersResponse" },
              },
            },
          },
        },
      },
    },
    "/users/{userId}": {
      get: {
        tags: ["Users"],
        summary: "Get public user profile",
        operationId: "getUserProfile",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "User profile",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_User" },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/users/{userId}/posts": {
      get: {
        tags: ["Users"],
        summary: "Get user's posts (paginated)",
        operationId: "getUserPosts",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "integer", default: 0 },
          },
        ],
        responses: {
          "200": {
            description: "User's posts",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_UserPostsResponse" },
              },
            },
          },
        },
      },
    },
    "/users/{userId}/follow": {
      post: {
        tags: ["Follows"],
        summary: "Follow a user",
        operationId: "followUser",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "201": {
            description: "Followed successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_FollowResponse" },
              },
            },
          },
          "400": {
            description: "Cannot follow yourself",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "403": {
            description: "Block relationship prevents follow",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "409": {
            description: "Already following this user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/users/{userId}/follow/{followingId}": {
      delete: {
        tags: ["Follows"],
        summary: "Unfollow a user",
        operationId: "unfollowUser",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "followingId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Unfollowed successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_MessageResponse" },
              },
            },
          },
          "403": {
            description: "Not allowed to modify this follow relationship",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Follow relationship not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/users/{userId}/followers": {
      get: {
        tags: ["Follows"],
        summary: "Get user's followers",
        operationId: "getFollowers",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Followers list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_FollowerArray" },
              },
            },
          },
        },
      },
    },
    "/users/{userId}/following": {
      get: {
        tags: ["Follows"],
        summary: "Get who a user follows",
        operationId: "getFollowing",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Following list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_FollowingArray" },
              },
            },
          },
        },
      },
    },
    "/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "List notifications (paginated)",
        operationId: "listNotifications",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "integer", default: 0 },
          },
        ],
        responses: {
          "200": {
            description: "Notifications list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_NotificationsResponse" },
              },
            },
          },
        },
      },
    },
    "/notifications/{notificationId}": {
      get: {
        tags: ["Notifications"],
        summary: "Get a single notification",
        operationId: "getNotification",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "notificationId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Notification details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_Notification" },
              },
            },
          },
          "404": {
            description: "Notification not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Notifications"],
        summary: "Mark notification as read/unread",
        operationId: "updateNotification",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "notificationId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["read"],
                properties: {
                  read: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Notification updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_Notification" },
              },
            },
          },
          "404": {
            description: "Notification not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Notifications"],
        summary: "Delete a notification",
        operationId: "deleteNotification",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "notificationId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Notification deleted",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_MessageResponse" },
              },
            },
          },
          "404": {
            description: "Notification not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/blocks": {
      get: {
        tags: ["Blocks"],
        summary: "List blocked users",
        operationId: "getBlockedUsers",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "integer", default: 0 },
          },
        ],
        responses: {
          "200": {
            description: "Blocked users list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_UserSummaryArray" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Blocks"],
        summary: "Block a user by username",
        operationId: "blockUser",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username"],
                properties: {
                  username: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User blocked",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_BlockRecord" },
              },
            },
          },
          "400": {
            description: "Cannot block yourself",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "409": {
            description: "User already blocked",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Blocks"],
        summary: "Unblock a user by username",
        operationId: "unblockUser",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username"],
                properties: {
                  username: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User unblocked",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_MessageResponse" },
              },
            },
          },
          "400": {
            description: "Cannot unblock yourself",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "User not found or not blocked",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/blocks/check/{userId}": {
      get: {
        tags: ["Blocks"],
        summary: "Check block status with a user",
        operationId: "checkBlockStatus",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Block status",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_BlockStatus" },
              },
            },
          },
        },
      },
    },
    "/billing/me": {
      get: {
        tags: ["Billing"],
        summary: "Get billing status and plan details",
        operationId: "getBillingStatus",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Billing status",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_BillingStatus" },
              },
            },
          },
        },
      },
    },
    "/billing/create-checkout-session": {
      post: {
        tags: ["Billing"],
        summary: "Create Stripe checkout session",
        operationId: "createCheckoutSession",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Checkout session URL",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_CheckoutSessionResponse" },
              },
            },
          },
          "400": {
            description: "Already on Pro plan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/billing/create-payment-intent": {
      post: {
        tags: ["Billing"],
        summary: "Create Stripe payment intent",
        operationId: "createPaymentIntent",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Payment intent client secret",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        clientSecret: {
                          type: "string",
                          description: "Stripe payment intent client secret",
                        },
                      },
                    },
                    error: { type: "null" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Already on Pro plan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/billing/confirm": {
      get: {
        tags: ["Billing"],
        summary: "Confirm payment after redirect",
        operationId: "confirmPayment",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "session_id",
            in: "query",
            schema: { type: "string" },
            description: "Stripe checkout session ID",
          },
          {
            name: "payment_intent_id",
            in: "query",
            schema: { type: "string" },
            description: "Stripe payment intent ID",
          },
        ],
        responses: {
          "200": {
            description: "Payment confirmed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_ConfirmPaymentResponse" },
              },
            },
          },
          "400": {
            description: "Missing session_id or payment_intent_id",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "403": {
            description: "Payment does not belong to this user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/billing/downgrade": {
      post: {
        tags: ["Billing"],
        summary: "Downgrade from PRO to FREE plan",
        operationId: "downgradePlan",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Plan downgraded",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_DowngradeResponse" },
              },
            },
          },
          "400": {
            description: "Already on Free plan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/billing/webhook": {
      post: {
        tags: ["Billing"],
        summary: "Stripe webhook receiver",
        operationId: "handleStripeWebhook",
        parameters: [
          {
            name: "stripe-signature",
            in: "header",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                description: "Raw Stripe event payload",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Webhook received",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_WebhookResponse" },
              },
            },
          },
          "400": {
            description: "Invalid webhook signature",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Webhook secret not configured",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/billing/webhook-health": {
      get: {
        tags: ["Billing"],
        summary: "Webhook health check",
        operationId: "webhookHealth",
        responses: {
          "200": {
            description: "Health status",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_HealthResponse" },
              },
            },
          },
        },
      },
    },
    "/billing/debug/recent-sessions": {
      get: {
        tags: ["Billing"],
        summary: "Debug: stripe customer and session info",
        operationId: "debugRecentSessions",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Stripe debug info",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_DebugSessionsResponse" },
              },
            },
          },
        },
      },
    },
    "/health/cache": {
      get: {
        tags: ["Health"],
        summary: "Cache health check",
        operationId: "cacheHealth",
        responses: {
          "200": {
            description: "Cache health status",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse_CacheHealthResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT access token",
      },
    },
    schemas: {
      ApiEnvelope: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: { nullable: true },
          error: { type: "string", nullable: true },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          data: { type: "null", nullable: true },
          error: { type: "string", example: "Error message" },
        },
      },
      SuccessResponse_MessageResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          error: { type: "null" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          username: { type: "string" },
          email: { type: "string", format: "email" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          plan: { type: "string", enum: ["FREE", "PRO"] },
        },
      },
      UserSummary: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          username: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          plan: { type: "string", enum: ["FREE", "PRO"] },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          accessToken: { type: "string", description: "JWT access token" },
          refreshToken: { type: "string", description: "JWT refresh token" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      RegisterInput: {
        type: "object",
        required: ["username", "email", "password", "firstName", "lastName"],
        properties: {
          username: { type: "string", minLength: 2 },
          email: { type: "string", format: "email" },
          password: {
            type: "string",
            minLength: 8,
            description: "Must contain uppercase, number, and special character",
          },
          firstName: { type: "string", minLength: 1 },
          lastName: { type: "string", minLength: 1 },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
      RefreshTokenInput: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: { type: "string" },
        },
      },
      Post: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          content: { type: "string" },
          imageUrl: { type: "string", format: "uri", nullable: true },
          visibility: { type: "string", enum: ["PUBLIC", "PRIVATE"] },
          likesCount: { type: "integer" },
          commentsCount: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          author: { $ref: "#/components/schemas/UserSummary" },
          likes: {
            type: "array",
            items: { type: "string", format: "uuid" },
            description: "Array of user IDs who liked the post",
          },
        },
      },
      Comment: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          content: { type: "string" },
          postId: { type: "string", format: "uuid" },
          parentId: { type: "string", format: "uuid", nullable: true },
          likesCount: { type: "integer" },
          repliesCount: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          author: { $ref: "#/components/schemas/UserSummary" },
        },
      },
      PostWithDetails: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          content: { type: "string" },
          imageUrl: { type: "string", format: "uri", nullable: true },
          visibility: { type: "string", enum: ["PUBLIC", "PRIVATE"] },
          likesCount: { type: "integer" },
          commentsCount: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          author: { $ref: "#/components/schemas/UserSummary" },
          likes: {
            type: "array",
            items: { type: "string", format: "uuid" },
          },
          comments: {
            type: "array",
            items: { $ref: "#/components/schemas/Comment" },
          },
        },
      },
      CreatePostInput: {
        type: "object",
        properties: {
          content: {
            type: "string",
            maxLength: 100,
            description: "Post content (max 100 chars, or 1000 for PRO users)",
          },
          image: {
            type: "string",
            format: "binary",
            description: "Image file to upload",
          },
          visibility: {
            type: "string",
            enum: ["PUBLIC", "PRIVATE"],
            default: "PUBLIC",
          },
        },
      },
      UpdatePostInput: {
        type: "object",
        properties: {
          content: {
            type: "string",
            maxLength: 100,
          },
          visibility: {
            type: "string",
            enum: ["PUBLIC", "PRIVATE"],
          },
        },
      },
      CreateCommentInput: {
        type: "object",
        required: ["content"],
        properties: {
          content: {
            type: "string",
            minLength: 1,
            maxLength: 500,
          },
          parentId: {
            type: "string",
            format: "uuid",
            nullable: true,
            description: "Parent comment ID for replies",
          },
        },
      },
      LikeResponse: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          postId: { type: "string", format: "uuid" },
          user: { $ref: "#/components/schemas/UserSummary" },
          createdAt: { type: "string", format: "date-time" },
          message: { type: "string" },
        },
      },
      CommentLikeResponse: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          commentId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          message: { type: "string" },
        },
      },
      LikeItem: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          postId: { type: "string", format: "uuid" },
          user: { $ref: "#/components/schemas/UserSummary" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      LikedUser: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          username: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          likedAt: { type: "string", format: "date-time" },
        },
      },
      Follower: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          followedAt: { type: "string", format: "date-time" },
          follower: { $ref: "#/components/schemas/UserSummary" },
        },
      },
      Following: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          followedAt: { type: "string", format: "date-time" },
          user: { $ref: "#/components/schemas/UserSummary" },
        },
      },
      Notification: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          type: { type: "string", enum: ["LIKE", "COMMENT", "NEW_FOLLOWER"] },
          message: { type: "string" },
          read: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          relatedUser: {
            nullable: true,
            allOf: [{ $ref: "#/components/schemas/UserSummary" }],
          },
          relatedPost: {
            nullable: true,
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              content: { type: "string" },
            },
          },
        },
      },
      FollowRecord: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          followerId: { type: "string", format: "uuid" },
          followingId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      BlockRecord: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          blockerId: { type: "string", format: "uuid" },
          blockedId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      BillingStatus: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: "string", format: "email" },
          plan: { type: "string", enum: ["FREE", "PRO"] },
          planStatus: { type: "string", nullable: true },
          planStartedAt: { type: "string", format: "date-time", nullable: true },
          stripeCurrentPeriodEndAt: { type: "string", format: "date-time", nullable: true },
          stripeSubscriptionId: { type: "string", nullable: true },
        },
      },
      PaginationMeta: {
        type: "object",
        properties: {
          total: { type: "integer" },
          limit: { type: "integer" },
          offset: { type: "integer" },
        },
      },
      CommentsResponse: {
        allOf: [
          { $ref: "#/components/schemas/PaginationMeta" },
          {
            type: "object",
            properties: {
              comments: {
                type: "array",
                items: { $ref: "#/components/schemas/Comment" },
              },
            },
          },
        ],
      },
      UserPostsResponse: {
        allOf: [
          { $ref: "#/components/schemas/PaginationMeta" },
          {
            type: "object",
            properties: {
              posts: {
                type: "array",
                items: { $ref: "#/components/schemas/Post" },
              },
            },
          },
        ],
      },
      SearchUsersResponse: {
        allOf: [
          { $ref: "#/components/schemas/PaginationMeta" },
          {
            type: "object",
            properties: {
              results: {
                type: "array",
                items: { $ref: "#/components/schemas/User" },
              },
            },
          },
        ],
      },
      NotificationsResponse: {
        allOf: [
          { $ref: "#/components/schemas/PaginationMeta" },
          {
            type: "object",
            properties: {
              notifications: {
                type: "array",
                items: { $ref: "#/components/schemas/Notification" },
              },
            },
          },
        ],
      },
      LikesListResponse: {
        allOf: [
          { $ref: "#/components/schemas/PaginationMeta" },
          {
            type: "object",
            properties: {
              likes: {
                type: "array",
                items: { $ref: "#/components/schemas/LikeItem" },
              },
            },
          },
        ],
      },
      DeleteCommentResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          deletedCount: { type: "integer" },
        },
      },
      BlockStatus: {
        type: "object",
        properties: {
          isBlocked: { type: "boolean" },
          blockedByMe: { type: "boolean" },
          blockedByThem: { type: "boolean" },
        },
      },
      ConfirmPaymentResponse: {
        type: "object",
        properties: {
          paymentStatus: { type: "string" },
          amount: { type: "number", nullable: true },
          currency: { type: "string", nullable: true },
          plan: { type: "string" },
        },
      },
      DowngradeResponse: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: "string" },
          plan: { type: "string", enum: ["FREE", "PRO"] },
          planStatus: { type: "string", nullable: true },
        },
      },
      WebhookResponse: {
        type: "object",
        properties: {
          received: { type: "boolean" },
        },
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "healthy" },
          timestamp: { type: "string", format: "date-time" },
          webhookSecret: { type: "string", example: "configured" },
        },
      },
      CacheHealthResponse: {
        type: "object",
        properties: {
          status: { type: "string" },
          cacheEnabled: { type: "boolean" },
          timestamp: { type: "string", format: "date-time" },
        },
      },
      DebugSessionsResponse: {
        type: "object",
        properties: {
          stripeCustomerId: { type: "string", nullable: true },
          plan: { type: "string" },
          planStatus: { type: "string", nullable: true },
          stripeCurrentPeriodEndAt: { type: "string", format: "date-time", nullable: true },
          stripeSubscriptionId: { type: "string", nullable: true },
        },
      },
      SuccessResponse_AuthResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/AuthResponse" },
          error: { type: "null" },
        },
      },
      SuccessResponse_User: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/User" },
          error: { type: "null" },
        },
      },
      SuccessResponse_Post: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/Post" },
          error: { type: "null" },
        },
      },
      SuccessResponse_PostArray: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Post" },
          },
          error: { type: "null" },
        },
      },
      SuccessResponse_PostWithDetails: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/PostWithDetails" },
          error: { type: "null" },
        },
      },
      SuccessResponse_Comment: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/Comment" },
          error: { type: "null" },
        },
      },
      SuccessResponse_CommentsResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/CommentsResponse" },
          error: { type: "null" },
        },
      },
      SuccessResponse_LikeResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/LikeResponse" },
          error: { type: "null" },
        },
      },
      SuccessResponse_CommentLikeResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/CommentLikeResponse" },
          error: { type: "null" },
        },
      },
      SuccessResponse_LikesListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/LikesListResponse" },
          error: { type: "null" },
        },
      },
      SuccessResponse_DeleteCommentResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/DeleteCommentResponse" },
          error: { type: "null" },
        },
      },
      SuccessResponse_SearchUsersResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/SearchUsersResponse" },
          error: { type: "null" },
        },
      },
      SuccessResponse_UserPostsResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/UserPostsResponse" },
          error: { type: "null" },
        },
      },
      SuccessResponse_FollowResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/FollowRecord" },
          error: { type: "null" },
        },
      },
      SuccessResponse_FollowerArray: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Follower" },
          },
          error: { type: "null" },
        },
      },
      SuccessResponse_FollowingArray: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Following" },
          },
          error: { type: "null" },
        },
      },
      SuccessResponse_Notification: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/Notification" },
          error: { type: "null" },
        },
      },
      SuccessResponse_NotificationsResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/NotificationsResponse" },
          error: { type: "null" },
        },
      },
      SuccessResponse_UserSummaryArray: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/UserSummary" },
          },
          error: { type: "null" },
        },
      },
      SuccessResponse_BlockRecord: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/BlockRecord" },
          error: { type: "null" },
        },
      },
      SuccessResponse_BlockStatus: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/BlockStatus" },
          error: { type: "null" },
        },
      },
      SuccessResponse_BillingStatus: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/BillingStatus" },
          error: { type: "null" },
        },
      },
      SuccessResponse_CheckoutSessionResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            properties: {
              url: { type: "string", format: "uri" },
            },
          },
          error: { type: "null" },
        },
      },
      SuccessResponse_ConfirmPaymentResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/ConfirmPaymentResponse" },
          error: { type: "null" },
        },
      },
      SuccessResponse_DowngradeResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/DowngradeResponse" },
          error: { type: "null" },
        },
      },
      SuccessResponse_WebhookResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/WebhookResponse" },
          error: { type: "null" },
        },
      },
      SuccessResponse_HealthResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/HealthResponse" },
          error: { type: "null" },
        },
      },
      SuccessResponse_CacheHealthResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/CacheHealthResponse" },
          error: { type: "null" },
        },
      },
      SuccessResponse_DebugSessionsResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/DebugSessionsResponse" },
          error: { type: "null" },
        },
      },
    },
  },
  tags: [
    { name: "Authentication", description: "User registration, login, logout, and token refresh" },
    { name: "Posts", description: "Create, read, update, and delete posts; feed endpoints" },
    { name: "Post Likes", description: "Like and unlike posts" },
    { name: "Comments", description: "Create, read, update, and delete comments" },
    { name: "Comment Likes", description: "Like and unlike comments" },
    { name: "Users", description: "User profiles and search" },
    { name: "Follows", description: "Follow and unfollow users" },
    { name: "Notifications", description: "List, read, and manage notifications" },
    { name: "Blocks", description: "Block, unblock, and check block status" },
    { name: "Billing", description: "Stripe billing, plans, and payment management" },
    { name: "Health", description: "Health check endpoints" },
  ],
};
