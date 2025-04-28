import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

class Analytics {
  private sessionId: string;
  
  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  async trackPageView(path: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          event: 'pageview',
          data: {
            path,
            sessionId: this.sessionId,
            userId: user?.id
          }
        })
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  async trackProductView(productId: number) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          event: 'product_view',
          data: {
            productId,
            sessionId: this.sessionId,
            userId: user?.id
          }
        })
      });
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  }
}

export const analytics = new Analytics();