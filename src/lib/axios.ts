import axios from "axios";

export const api = {
    getCurrentUser: async () => {

        const { data } = await axios.get("/api/get-current-user");
        return data;
    },
    getUser: async (userId: string) => {

        const { data } = await axios.get("/api/get-user/" + userId);
        return data;
    },
    followUser: async (userId: string) => {

        const { data } = await axios.post("/api/follow-user/" + userId);
        return data;
    },
    createPost: async (postData: { content: string }) => {

        const { data } = await axios.post("/api/create-post", postData);
        return data;
    },
    getPosts: async () => {

        const { data } = await axios.get("/api/get-posts");
        return data;
    },
    getUserPosts: async (userId: string) => {
        const { data } = await axios.get("/api/get-user-posts/" + userId);
        return data;
    },
    getPost: async (postId: string) => {
        const { data } = await axios.get("/api/get-post/" + postId);
        return data;
    },
    likePost: async (postId: string) => {
        const { data } = await axios.post("/api/like-post/" + postId);
        return data;
    },
    replyToPost: async (postId: string, contentData: { content: string }) => {
        const { data } = await axios.post("/api/reply-to-post/" + postId, contentData);
        return data;
    }
}