import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { PostStyle } from '../types';

interface SaveStyleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  style: PostStyle;
}

export default function SaveStyleModal({ open, onOpenChange, style }: SaveStyleModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      setError('Le nom est requis');
      return;
    }

    try {
      // Get existing styles from localStorage
      const savedStyles = JSON.parse(localStorage.getItem('savedStyles') || '[]');
      
      // Check if name already exists
      if (savedStyles.some((s: PostStyle) => s.name === name)) {
        setError('Ce nom existe déjà');
        return;
      }

      // Save new style
      const newStyle = { ...style, name };
      savedStyles.push(newStyle);
      localStorage.setItem('savedStyles', JSON.stringify(savedStyles));

      // Reset and close
      setName('');
      setError('');
      onOpenChange(false);
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sauvegarder le style</DialogTitle>
          <DialogDescription>
            Donnez un nom à votre style pour le sauvegarder
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Nom du style</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Mon style personnalisé"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Sauvegarder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}