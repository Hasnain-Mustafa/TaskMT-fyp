import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CURRENT_USER } from "./GraphQL/Queries";

const MyComponent = () => {
  const { loading, error, data } = useQuery(GET_CURRENT_USER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const user = data.getCurrentLoggedInUser;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      {/* Render other components */}
    </div>
  );
};

export default MyComponent;
