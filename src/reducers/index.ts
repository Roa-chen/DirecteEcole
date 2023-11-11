import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./User";

const store = configureStore({
  reducer: {
    BlocEditor: userReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;