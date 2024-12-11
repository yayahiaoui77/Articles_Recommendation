

import React from "react";
import { useLocation } from "react-router-dom";

function Article_readmore() {
  const location = useLocation();
  const { article } = location.state || {};

  if (!article) {
    return <p>No article data available.</p>;
  }

  return (
    <div className="p-24 bg-[#FFF2D8]">
      <div className="bg-[#FFFBF0] p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-[#113946]">{article.title}</h1>
        <p className="text-sm text-[#BCA37F]">
          <strong>Author:</strong> {article.author}
        </p>
        <p className="text-sm text-[#BCA37F]">
          <strong>Tags:</strong> {article.tags.join(", ")}
        </p>
        <p className="text-base mt-4 whitespace-pre-line">{article.content}</p>
      </div>
    </div>
  );
}

export default Article_readmore
