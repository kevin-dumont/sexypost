import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import TextareaAutosize from 'react-textarea-autosize';
import { Wand2 } from 'lucide-react';
import { ListItem } from '../types';
import { supabase } from '../lib/supabase';

interface AIGenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerated: (title: string, items: ListItem[]) => void;
}

export default function AIGenerationModal({ open, onOpenChange, onGenerated }: AIGenerationModalProps) {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic) return;

    setIsGenerating(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError("Vous devez être connecté pour utiliser la génération IA");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          itemCount: 4,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate content');

      const data = await response.json();
      onGenerated(data.title, data.items);
      onOpenChange(false);
      setTopic('');
    } catch (error) {
      setError("Une erreur est survenue lors de la génération");
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Génération IA</DialogTitle>
          <DialogDescription>
            Décrivez votre sujet et laissez l'IA générer le contenu de votre post
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Sujet</Label>
            <TextareaAutosize
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Décrivez votre sujet ici..."
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !topic}
            className="w-full"
          >
            <Wand2 className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Génération en cours...' : 'Générer le contenu'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}