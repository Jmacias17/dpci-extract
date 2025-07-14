export const cleanDpci = (raw) => {
    const DPCI_REGEX = /^\d{3}-\d{2}-\d{4}$/;
  
    const cleaned = raw
      .trim()
      .replace(/[O]/gi, '0')
      .replace(/[lI]/g, '1')
      .replace(/[.,:;]/g, '-')
      .replace(/\s/g, '');
  
    return DPCI_REGEX.test(cleaned) ? cleaned : null;
  };
  