import { useState, useCallback } from 'react';

export const useAccountVerification = () => {
  const [verifiedRecipient, setVerifiedRecipient] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyAccount = useCallback((accountNumber) => {
    if (accountNumber.length !== 10 || isNaN(accountNumber)) {
      setVerifiedRecipient(null);
      return;
    }

    setIsVerifying(true);
    setVerifiedRecipient(null);

    setTimeout(() => {
      let name, bank;
      const prefix = accountNumber.substring(0, 3);

      if (prefix === '903') {
        name = 'Simulated OPay User';
        bank = 'Opay Bank';
      } else if (prefix === '010') {
        name = 'Jane Doe';
        bank = 'First Bank PLC';
      } else if (prefix === '058') {
        name = 'Musa Sani';
        bank = 'GT Bank';
      } else {
        name = 'Unregistered User';
        bank = 'Unknown Bank';
      }

      setVerifiedRecipient({ name, bank });
      setIsVerifying(false);
    }, 1000);
  }, []);

  return { verifiedRecipient, isVerifying, verifyAccount };
};
