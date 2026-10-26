import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRightRegular } from '@fluentui/react-icons';
import { Button } from '@fluentui/react-components';
import CoupleVideoScene from './CoupleVideoScene.jsx';
import WeddingFlorals from './WeddingFlorals.jsx';

export default function RoyalEnvelope({ couple, guest, onOpen }) {
  const buttonRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  function keepFocusInEntry(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      buttonRef.current?.focus();
    }
  }

  return (
    <motion.div
      className="envelope-stage"
      role="dialog"
      aria-modal="true"
      aria-labelledby="envelope-title"
      onKeyDown={keepFocusInEntry}
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
      transition={{ duration: reducedMotion ? 0.01 : 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <WeddingFlorals variant="cover" />
      <CoupleVideoScene />
      <p className="envelope-kicker">With joyful hearts, for</p>
      <h1 id="envelope-title" className="envelope-title">{couple}</h1>
      <p className="envelope-intro">A personal invitation for</p>
      <p className="envelope-recipient">{guest}</p>
      <Button
        ref={buttonRef}
        appearance="primary"
        icon={<ArrowRightRegular />}
        onClick={onOpen}
        aria-label="Open the wedding invitation"
      >
        Open the invitation
      </Button>
      <span className="envelope-note">Bengaluru · 18-19 November 2026</span>
    </motion.div>
  );
}