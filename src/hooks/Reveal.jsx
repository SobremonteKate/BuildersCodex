import { useReveal } from "./useReveal";

/** Fades + slides its children up into place the first time they scroll into view. */
export function Reveal({ className = "", children, ...rest }) {
  const [ref, inView] = useReveal();
  return (
    <div ref={ref} className={`reveal${inView ? " in-view" : ""} ${className}`} {...rest}>
      {children}
    </div>
  );
}