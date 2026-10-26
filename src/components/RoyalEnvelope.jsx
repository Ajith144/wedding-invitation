import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightRegular, MailRegular } from '@fluentui/react-icons';
import { Button } from '@fluentui/react-components';

export default function RoyalEnvelope({ guest, onOpen }) {
  const buttonRef = useRef(null);

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="envelope-art" aria-hidden="true">
        <div className="envelope-paper" />
        <div className="envelope-flap" />
        <div className="envelope-seal"><span>A&amp;A</span></div>
      </div>
      <p className="envelope-kicker">With joyful hearts, for</p>
      <h1 id="envelope-title" className="envelope-title">Ananya &amp; Arjun</h1>
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