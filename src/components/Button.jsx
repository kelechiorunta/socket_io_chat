// src/components/ui/Button.jsx
import { Button as BsButton } from 'react-bootstrap';

const Button = ({
  children,
  onClick,
  variant = 'outline-light',
  size = 'sm',
  className = '',
  ...props
}) => {
  return (
    <BsButton onClick={onClick} variant={variant} size={size} className={className} {...props}>
      {children}
    </BsButton>
  );
};

export default Button;
