import './animateText.scss';
import React, { useEffect, useRef } from 'react';
import { animateText } from './animate.js';

const AnimateText = ({ texts = [], speed = 100, delay = 5000 }) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      let isMounted = true;

      const runTypingLoop = async () => {
        let index = 0;

        while (isMounted) {
          const currentText = texts[index];

          if (textRef.current) {
            await animateText(currentText, textRef.current, speed, delay);
          }

          await new Promise((resolve) => setTimeout(resolve, 500)); // wait before next word

          index = (index + 1) % texts.length;
          // isMounted = false;
        }
      };

      runTypingLoop();

      return () => {
        isMounted = false;
        // textRef.current.innerHTML = '';
      };
    }
  }, [speed, delay, textRef, texts]); // Only re-run if config changes

  return (
    <div
      className="m-auto"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        fontWeight: 'bolder',
        fontSize: '2.75rem',
        textAlign: 'center',
        margin: 'auto',
        // padding: '0.5rem',
        height: '30px'

        // fontFamily: 'monospace'
        // color: 'black'
      }}
      ref={textRef}
    >
      {/* <div
        style={{
          width: '100%',
          fontWeight: 'bolder',
          //   margin: 'auto',
          //   padding: 'auto',
          textAlign: 'center',
          height: 'auto'
        }}
        ref={textRef}
      ></div> */}
    </div>
  );
};

export default AnimateText;
