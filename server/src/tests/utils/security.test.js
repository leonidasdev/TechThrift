import { sanitizeHtml, sanitizeQuery } from '../../utils/security.js';

describe('Security Utils', () => {
  describe('sanitizeHtml', () => {
    it('should escape HTML entities', () => {
      const input = '<script>alert("xss")</script>';
      const result = sanitizeHtml(input);
      expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });

    it('should handle non-string input', () => {
      expect(sanitizeHtml(123)).toBe(123);
      expect(sanitizeHtml(null)).toBe(null);
      expect(sanitizeHtml(undefined)).toBe(undefined);
    });

    it('should escape quotes and ampersands', () => {
      const input = 'Hello & "world" & \'test\'';
      const result = sanitizeHtml(input);
      expect(result).toBe('Hello &amp; &quot;world&quot; &amp; &#x27;test&#x27;');
    });
  });

  describe('sanitizeQuery', () => {
    it('should remove SQL injection patterns', () => {
      const input = "'; DROP TABLE users; --";
      const result = sanitizeQuery(input);
      expect(result).not.toContain('DROP');
      expect(result).not.toContain(';');
    });

    it('should remove dangerous SQL keywords', () => {
      const input = 'SELECT * FROM users WHERE id = 1';
      const result = sanitizeQuery(input);
      expect(result).not.toContain('SELECT');
      expect(result).not.toContain('FROM');
    });

    it('should handle normal search queries', () => {
      const input = 'laptop gaming';
      const result = sanitizeQuery(input);
      expect(result).toBe('laptop gaming');
    });
  });
});