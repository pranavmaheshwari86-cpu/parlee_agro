"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTitleProps {
  title: string;
  containerClass?: string;
  textClass?: string;
  gapClass?: string;
}

const AnimatedTitle = ({ title, containerClass = "", textClass = "", gapClass = "gap-2 md:gap-3" }: AnimatedTitleProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "center bottom",
          toggleActions: "play none none reverse",
        },
      });

      titleAnimation.from(
        ".animated-word",
        {
          opacity: 0,
          transform: "translate3d(10px, 51px, -60px) rotateY(60deg) rotateX(-40deg)",
          ease: "power2.inOut",
          stagger: 0.02,
        },
        0
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={`animated-title ${containerClass}`}>
      {title.split("<br />").map((line, index) => (
        <div
          key={index}
          className={`flex max-w-full flex-wrap justify-center px-4 md:px-10 ${gapClass}`}
        >
          {line.split(" ").map((word, idx) => (
            <span
              key={idx}
              className={`animated-word ${textClass}`}
              dangerouslySetInnerHTML={{ __html: word }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default AnimatedTitle;
