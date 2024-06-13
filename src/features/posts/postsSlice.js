import { createSlice, nanoid,createAsyncThunk } from "@reduxjs/toolkit";

import { sub } from "date-fns"

import { client } from "../../api/client";

const initialState = {
// { id: "1", title: "First Post!", content: "Hello!", user: "0", date: sub(new Date(), { minutes: 10 }).toISOString(), reactions:{}},
// { id: "2", title: "Second Post", content: "More text", user: "1", date: sub(new Date(), { minutes: 5 }).toISOString(), reactions:{}},
  posts: [],
  status: "idle",
  error: null
};

  export const fetchPosts = createAsyncThunk("post/fetchPosts", async() => {
    const response = await client.get("/fakeApi/posts")
    return response.data
  })

  export const addNewPost = createAsyncThunk("post/addNewPost", async (initialPost)=>{
    const response = await client.post("/fakeApi/posts", initialPost)
    return response.data
  }) 

  const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
      // postAdded(state, action) {
      //   state.push(action.payload)
      // },
      // postAdded: {
      //   reducer(state,action){
      //     state.posts.push(action.payload)
      //   },
      //   prepare(title, content, userId) {
      //     return {
      //       payload: {
      //         id: nanoid(),
      //         title,
      //         content,
      //         user: userId,
      //         date: new Date().toISOString()
      //       }
      //     }
      //   }
      // },
      postUpdated(state,action) {
        const {id,title,content} = action.payload
        const existingPost = state.posts.find((post) => post.id === id)
        if(existingPost) {
          existingPost.title = title
          existingPost.content = content
        }
      },
      reactionAdded(state,action){
        const {postId, reaction} = action.payload
        const existingPost = state.posts.find((post) => post.id === postId)
        if(existingPost) {
          existingPost.reactions[reaction] === undefined ? existingPost.reactions[reaction] = 1 : existingPost.reactions[reaction]++
        }
      }
    },
    extraReducers(builder) {
      builder.addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading"
      }).addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.posts = state.posts.concat(action.payload)
      }).addCase(fetchPosts.rejected, (state, action)=>{
        state.status = "failed"
        state.error = action.error.message
      }).addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload)
      })
    }
  });
  
  export const {postAdded, postUpdated, reactionAdded} = postsSlice.actions

  export const selectAllPosts = (state) => state.posts.posts

  export const selectPostById = (state, postId) => state.posts.find((post) => post.id === postId) 

  export default postsSlice.reducer;