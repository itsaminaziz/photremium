import React, { createContext, useContext, useState, useCallback } from 'react';

const ContactContext = createContext(null);

export const ContactProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openContact  = useCallback(() => setIsOpen(true),  []);
  const closeContact = useCallback(() => setIsOpen(false), []);

  return (
    <ContactContext.Provider value={{ isOpen, openContact, closeContact }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error('useContact must be used inside ContactProvider');
  return ctx;
};
