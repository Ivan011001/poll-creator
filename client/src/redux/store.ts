import { configureStore } from "@reduxjs/toolkit";

import { pollsReducer } from "./polls/polls-slice";

// import {
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
//   persistReducer,
// } from "redux-persist";
// import createWebStorage from "redux-persist/lib/storage/createWebStorage";
// import { WebStorage } from "redux-persist/lib/types";

// export function createPersistStorage(): WebStorage {
//   const isServer = typeof window === "undefined";

//   if (isServer) {
//     return {
//       getItem() {
//         return Promise.resolve(null);
//       },
//       setItem() {
//         return Promise.resolve();
//       },
//       removeItem() {
//         return Promise.resolve();
//       },
//     };
//   }

//   return createWebStorage("local");
// }

// const storage = createPersistStorage();

// const persistConfig = {
//   key: "counter",
//   storage,
// };

// const persistedCounter = persistReducer(persistConfig, counterReducer);

export const makeStore = () => {
  return configureStore({
    reducer: {
      polls: pollsReducer,
    },
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware({
    //     serializableCheck: {
    //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    //     },
    //   }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
