import { useState, useEffect, useCallback } from 'react';

interface DraftData {
  content: string;
  timestamp: number;
}

const DRAFT_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function useDraft(key: string) {
  const [draft, setDraftState] = useState<string>('');

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const data: DraftData = JSON.parse(stored);
        const isExpired = Date.now() - data.timestamp > DRAFT_EXPIRY_MS;
        
        if (!isExpired && data.content) {
          setDraftState(data.content);
        } else if (isExpired) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  }, [key]);

  // Save draft to localStorage
  const setDraft = useCallback((value: string) => {
    setDraftState(value);
    
    try {
      if (value) {
        const data: DraftData = {
          content: value,
          timestamp: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(data));
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [key]);

  // Clear draft
  const clearDraft = useCallback(() => {
    setDraftState('');
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }, [key]);

  return { draft, setDraft, clearDraft };
}
