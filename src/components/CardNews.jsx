import React from "react";

const CardNews = ({ source, author, title, url, publishedAt }) => {
  return (
    <div className="card mb-3 h-100">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          Published At: {new Date(publishedAt).toLocaleString()}
        </h6>
        <h6 className="card-subtitle mb-2 text-muted">Source: {source.name}</h6>
        <p className="card-text">Author: {author}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="card-link"
        >
          Read more
        </a>
      </div>
    </div>
  );
};

export default CardNews;
