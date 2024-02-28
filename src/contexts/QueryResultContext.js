import React, { createContext, useContext } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "../GraphQL/Queries";
const QueryResultContext = createContext();

export const QueryResultProvider = ({ children }) => {
  const [getCurrentUser, { data, loading, error }] = useLazyQuery(GET_CURRENT_USER);

  return (
    <QueryResultContext.Provider value={{ data, loading, error, getCurrentUser }}>
      {children}
    </QueryResultContext.Provider>
  );
};

export const useQueryResult = () => {
  const context = useContext(QueryResultContext);
  if (!context) {
    throw new Error("useQueryResult must be used within a QueryResultProvider");
  }
  return context;
};
