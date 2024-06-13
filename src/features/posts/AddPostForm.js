import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postAdded } from "./postsSlice";
// import { nanoid } from "@reduxjs/toolkit";

export const AddPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(e.target.value);

  const dispatch = useDispatch()

  const users = useSelector((state) => state.users)

  const onSavePostClicked = async () => {
    if(canSave) {
      try {
        setAddRequestStatus("pendding")
        await dispatch(addNewPost({title, content, user:userId})).unwrap()
        setTitle("")
        setContent("")
        setUserId("")
      } catch (error) {
        
      } finally {
        setAddRequestStatus("idle")
      }
    }
    if(title && content) {
        // dispatch(postAdded({
        //     id: nanoid(),
        //     title,
        //     content,
        //   }))
        dispatch(postAdded(title,content))
        
    }
    
  }

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  const canSave = Boolean(title) && Boolean(content) && Boolean(userId) && addRequestStatus === "idle";

  return (
    <section>
      <h2>添加新文章</h2>
      <form>
        <label htmlFor="postTitle">文章标题:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">作者:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">内容：</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>保存文章</button>
      </form>
    </section>
  );
};