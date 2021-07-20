import React from 'react';

type IndexProps = {
  message: string;
};

// Export async function getEdgeProps() {
//   return {
//     props: {
//       message: "Hello",
//     } as IndexProps,
//   };
export default function Index() {
  const message = 'Hello world';
  return (
    <div>
      <p>{message}</p>
    </div>
  );
}
