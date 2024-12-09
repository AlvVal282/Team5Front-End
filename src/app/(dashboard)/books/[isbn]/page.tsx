"use client";

import SingleBook from "views/books/single-book";

const SingleBookPage = ({ params }: { params: { isbn: string } }) => {
  const { isbn } = params; // Get the dynamic ISBN from the route

  return <SingleBook isbn={isbn} />; // Pass it to the SingleBook component
};

export default SingleBookPage;

