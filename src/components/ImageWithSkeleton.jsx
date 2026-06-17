import { useState } from 'react';
import Skeleton from './Skeleton';

export default function ImageWithSkeleton({ src, alt, className = '', fallback, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!loaded && <Skeleton className="absolute inset-0 w-full h-full rounded-none" />}
      <img
        src={errored ? fallback : src}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          setErrored(true);
          setLoaded(true);
          if (fallback) e.target.src = fallback;
        }}
        {...props}
      />
    </div>
  );
}
