export const attachMagneticEffect = (element: HTMLElement, strength = 14) => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return () => {};

  const handleMove = (event: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const relativeY = event.clientY - rect.top;

    const x = relativeX - rect.width / 2;
    const y = relativeY - rect.height / 2;

    const offsetX = (x / rect.width) * strength;
    const offsetY = (y / rect.height) * strength;

    element.style.setProperty("--trail-x", `${relativeX}px`);
    element.style.setProperty("--trail-y", `${relativeY}px`);
    element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
  };

  const handleEnter = () => {
    element.classList.add("is-magnetic-active");
  };

  const handleLeave = () => {
    element.classList.remove("is-magnetic-active");
    element.style.transform = "translate3d(0, 0, 0)";
  };

  element.addEventListener("mouseenter", handleEnter);
  element.addEventListener("mousemove", handleMove);
  element.addEventListener("mouseleave", handleLeave);

  return () => {
    element.removeEventListener("mouseenter", handleEnter);
    element.removeEventListener("mousemove", handleMove);
    element.removeEventListener("mouseleave", handleLeave);
  };
};
