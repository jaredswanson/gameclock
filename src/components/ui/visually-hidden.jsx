import React from 'react';

export const VisuallyHidden = ({ as: Component = 'span', children, ...props }) => (
  <Component className="sr-only" {...props}>{children}</Component>
);
