
import React from "react";

type LazyImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  loading?: "lazy" | "eager";
};

export const LazyImage: React.FC<LazyImageProps> = ({ 
  loading = "lazy", 
  ...props 
}) => {
  return <img loading={loading} {...props} />;
};
