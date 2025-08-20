import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

import uploaderReducer from './uploader/uploader.slice';
import searchReducer from './search/search.slice';
import qaReducer from './qa/qa.slice';

export const store = configureStore({
  reducer: {
    uploader: uploaderReducer,
    search: searchReducer,
    qa: qaReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['uploader/uploadFiles/fulfilled'],
        ignoredPaths: ['uploader.uploadedFiles'],
      },
    }),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const LoadingState = {
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
} as const;

export type LoadingState = typeof LoadingState[keyof typeof LoadingState];