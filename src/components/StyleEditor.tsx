import React, { useRef } from "react";
import { PostStyle } from "../types";
import { Label } from "./ui/label";
import { stylePresets } from "../styles/presets";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import StyleImportExport from "./StyleImportExport";
import { ColorPicker } from "./ui/color-picker";

interface StyleEditorProps {
  currentStyle: PostStyle;
  onStyleChange: (style: PostStyle) => void;
}

interface SizeControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}

const SizeControl = ({
  label,
  value,
  onChange,
  min = 8,
  max = 72,
  unit = "px",
}: SizeControlProps) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <Label>{label}</Label>
      <span className="text-sm text-gray-500">
        {value}
        {unit}
      </span>
    </div>
    <Slider
      value={[value]}
      onValueChange={([value]) => onChange(value)}
      min={min}
      max={max}
      step={1}
      className="py-2"
    />
  </div>
);

export default function StyleEditor({
  currentStyle,
  onStyleChange,
}: StyleEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundImageInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newStyle = { ...currentStyle };
        newStyle.footer.photoUrl = reader.result as string;
        onStyleChange(newStyle);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newStyle = { ...currentStyle };
        newStyle.background.type = "image";
        newStyle.background.imageUrl = reader.result as string;
        onStyleChange(newStyle);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-3 border-b space-y-4">
        <h2 className="text-lg font-semibold">Styles</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Accordion type="single" collapsible>
          {/* Couleurs */}
          <AccordionItem value="colors" className="px-6">
            <AccordionTrigger>Couleurs</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <h3 className="font-medium">Arrière-plan</h3>
                <div className="space-y-2">
                  <Label>Type d'arrière-plan</Label>
                  <select
                    className="w-full h-9 rounded-md border px-3 py-1 text-sm"
                    value={currentStyle.background.type}
                    onChange={(e) => {
                      const newStyle = { ...currentStyle };
                      newStyle.background.type = e.target.value as
                        | "solid"
                        | "gradient"
                        | "image";
                      onStyleChange(newStyle);
                    }}
                  >
                    <option value="solid">Couleur unie</option>
                    <option value="gradient">Dégradé</option>
                    <option value="image">Image</option>
                  </select>
                </div>

                {currentStyle.background.type === "image" ? (
                  <>
                    <div className="space-y-2">
                      <Label>Image de fond</Label>
                      <input
                        type="file"
                        ref={backgroundImageInputRef}
                        onChange={handleBackgroundImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => backgroundImageInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Changer l'image
                      </Button>
                      {currentStyle.background.imageUrl && (
                        <div className="mt-2">
                          <img
                            src={currentStyle.background.imageUrl}
                            alt="Background preview"
                            className="w-full h-32 object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Assombrissement</Label>
                        <span className="text-sm text-gray-500">
                          {Math.round(
                            (currentStyle.background.imageDarkness || 0) * 100
                          )}
                          %
                        </span>
                      </div>
                      <Slider
                        value={[
                          (currentStyle.background.imageDarkness || 0) * 100,
                        ]}
                        onValueChange={([value]) => {
                          const newStyle = { ...currentStyle };
                          newStyle.background.imageDarkness = value / 100;
                          onStyleChange(newStyle);
                        }}
                        min={0}
                        max={100}
                        step={5}
                        className="py-2"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {currentStyle.background.type === "gradient" && (
                      <>
                        <div className="space-y-2">
                          <Label>Type de dégradé</Label>
                          <select
                            className="w-full h-9 rounded-md border px-3 py-1 text-sm"
                            value={currentStyle.background.gradientType}
                            onChange={(e) => {
                              const newStyle = { ...currentStyle };
                              newStyle.background.gradientType = e.target
                                .value as "linear" | "radial";
                              onStyleChange(newStyle);
                            }}
                          >
                            <option value="linear">Linéaire</option>
                            <option value="radial">Radial</option>
                          </select>
                        </div>

                        {currentStyle.background.gradientType === "linear" && (
                          <div className="space-y-2">
                            <Label>Direction du dégradé</Label>
                            <select
                              className="w-full h-9 rounded-md border px-3 py-1 text-sm"
                              value={currentStyle.background.gradientDirection}
                              onChange={(e) => {
                                const newStyle = { ...currentStyle };
                                newStyle.background.gradientDirection = e.target
                                  .value as any;
                                onStyleChange(newStyle);
                              }}
                            >
                              <option value="to right">Droite</option>
                              <option value="to bottom right">
                                Bas droite
                              </option>
                              <option value="to bottom">Bas</option>
                              <option value="to bottom left">Bas gauche</option>
                              <option value="to left">Gauche</option>
                              <option value="to top left">Haut gauche</option>
                              <option value="to top">Haut</option>
                              <option value="to top right">Haut droite</option>
                            </select>
                          </div>
                        )}
                      </>
                    )}

                    <ColorPicker
                      label="Couleur principale"
                      value={currentStyle.background.color}
                      onChange={(value) => {
                        const newStyle = { ...currentStyle };
                        newStyle.background.color = value;
                        onStyleChange(newStyle);
                      }}
                    />

                    {currentStyle.background.type === "gradient" && (
                      <ColorPicker
                        label="Couleur secondaire"
                        value={currentStyle.background.gradientColor || "#000000"}
                        onChange={(value) => {
                          const newStyle = { ...currentStyle };
                          newStyle.background.gradientColor = value;
                          onStyleChange(newStyle);
                        }}
                      />
                    )}
                  </>
                )}

                <ColorPicker
                  label="Couleur d'accentuation"
                  value={currentStyle.background.accentColor}
                  onChange={(value) => {
                    const newStyle = { ...currentStyle };
                    newStyle.background.accentColor = value;
                    onStyleChange(newStyle);
                  }}
                />

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-4">Textes</h3>
                  <div className="space-y-4">
                    <ColorPicker
                      label="Titre principal"
                      value={currentStyle.colors.title}
                      onChange={(value) => {
                        const newStyle = { ...currentStyle };
                        newStyle.colors.title = value;
                        onStyleChange(newStyle);
                      }}
                    />

                    <ColorPicker
                      label="Titres des cartes"
                      value={currentStyle.colors.itemTitle}
                      onChange={(value) => {
                        const newStyle = { ...currentStyle };
                        newStyle.colors.itemTitle = value;
                        onStyleChange(newStyle);
                      }}
                    />

                    <ColorPicker
                      label="Descriptions"
                      value={currentStyle.colors.description}
                      onChange={(value) => {
                        const newStyle = { ...currentStyle };
                        newStyle.colors.description = value;
                        onStyleChange(newStyle);
                      }}
                    />

                    <ColorPicker
                      label="Numéros"
                      value={currentStyle.colors.itemNumber}
                      onChange={(value) => {
                        const newStyle = { ...currentStyle };
                        newStyle.colors.itemNumber = value;
                        onStyleChange(newStyle);
                      }}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-4">Pied de page</h3>
                  <div className="space-y-4">
                    <ColorPicker
                      label="Nom"
                      value={currentStyle.colors.footerName}
                      onChange={(value) => {
                        const newStyle = { ...currentStyle };
                        newStyle.colors.footerName = value;
                        onStyleChange(newStyle);
                      }}
                    />

                    <ColorPicker
                      label="Sous-titre"
                      value={currentStyle.colors.footerSubtitle}
                      onChange={(value) => {
                        const newStyle = { ...currentStyle };
                        newStyle.colors.footerSubtitle = value;
                        onStyleChange(newStyle);
                      }}
                    />

                    <ColorPicker
                      label="Texte à droite"
                      value={currentStyle.colors.footerRight}
                      onChange={(value) => {
                        const newStyle = { ...currentStyle };
                        newStyle.colors.footerRight = value;
                        onStyleChange(newStyle);
                      }}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Typographie */}
          <AccordionItem value="typography" className="px-6">
            <AccordionTrigger>Typographie</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Police</Label>
                  <select
                    className="w-full h-9 rounded-md border px-3 py-1 text-sm"
                    value={currentStyle.font}
                    onChange={(e) => {
                      const newStyle = { ...currentStyle };
                      newStyle.font = e.target.value;
                      onStyleChange(newStyle);
                    }}
                  >
                    <option value="'Inter', sans-serif">Inter</option>
                    <option value="'Roboto', sans-serif">Roboto</option>
                    <option value="'Poppins', sans-serif">Poppins</option>
                  </select>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-medium">Tailles</h3>
                  <SizeControl
                    label="Titre principal"
                    value={currentStyle.titleSize}
                    onChange={(value) => {
                      const newStyle = { ...currentStyle };
                      newStyle.titleSize = value;
                      onStyleChange(newStyle);
                    }}
                    min={24}
                    max={48}
                  />

                  <SizeControl
                    label="Titres des cartes"
                    value={currentStyle.itemTitleSize}
                    onChange={(value) => {
                      const newStyle = { ...currentStyle };
                      newStyle.itemTitleSize = value;
                      onStyleChange(newStyle);
                    }}
                    min={14}
                    max={32}
                  />

                  <SizeControl
                    label="Descriptions"
                    value={currentStyle.descriptionSize}
                    onChange={(value) => {
                      const newStyle = { ...currentStyle };
                      newStyle.descriptionSize = value;
                      onStyleChange(newStyle);
                    }}
                    min={12}
                    max={24}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Espacement */}
          <AccordionItem value="spacing" className="px-6">
            <AccordionTrigger>Espacement</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Marges du contenu</h3>
                  <SizeControl
                    label="Haut"
                    value={currentStyle.contentPadding.top}
                    onChange={(value) => {
                      const newStyle = { ...currentStyle };
                      newStyle.contentPadding.top = value;
                      onStyleChange(newStyle);
                    }}
                    min={0}
                    max={64}
                  />

                  <SizeControl
                    label="Droite"
                    value={currentStyle.contentPadding.right}
                    onChange={(value) => {
                      const newStyle = { ...currentStyle };
                      newStyle.contentPadding.right = value;
                      onStyleChange(newStyle);
                    }}
                    min={0}
                    max={64}
                  />

                  <SizeControl
                    label="Bas"
                    value={currentStyle.contentPadding.bottom}
                    onChange={(value) => {
                      const newStyle = { ...currentStyle };
                      newStyle.contentPadding.bottom = value;
                      onStyleChange(newStyle);
                    }}
                    min={0}
                    max={64}
                  />

                  <SizeControl
                    label="Gauche"
                    value={currentStyle.contentPadding.left}
                    onChange={(value) => {
                      const newStyle = { ...currentStyle };
                      newStyle.contentPadding.left = value;
                      onStyleChange(newStyle);
                    }}
                    min={0}
                    max={64}
                  />
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-medium">Marges du pied de page</h3>
                  <SizeControl
                    label="Haut"
                    value={currentStyle.footerPadding.top}
                    onChange={(value) => {
                      const newStyle = { ...currentStyle };
                      newStyle.footerPadding.top = value;
                      onStyleChange(newStyle);
                    }}
                    min={0}
                    max={48}
                  />

                  <SizeControl
                    label="Droite"
                    value={currentStyle.footerPadding.right}
                    onChange={(value) => {
                      const newStyle = { ...currentStyle };
                      newStyle.footerPadding.right = value;
                      onStyleChange(newStyle);
                    }}
                    min={0}
                    max={48}
                  />

                  <SizeControl
                    label="Bas"
                    value={currentStyle.footerPadding.bottom}
                    onChange={(value) => {
                      const newStyle = { ...currentStyle };
                      newStyle.footerPadding.bottom = value;
                      onStyleChange(newStyle);
                    }}
                    min={0}
                    max={48}
                  />

                  <SizeControl
                    label="Gauche"
                    value={currentStyle.footerPadding.left}
                    onChange={(value) => {
                      const newStyle = { ...currentStyle };
                      newStyle.footerPadding.left = value;
                      onStyleChange(newStyle);
                    }}
                    min={0}
                    max={48}
                  />
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-medium">Espacement des cartes</h3>
                  <SizeControl
                    label="Espace entre les cartes"
                    value={currentStyle.itemSpacing}
                    onChange={(value) => {
                      const newStyle = { ...currentStyle };
                      newStyle.itemSpacing = value;
                      onStyleChange(newStyle);
                    }}
                    min={8}
                    max={48}
                  />

                  <SizeControl
                    label="Espace titre/description"
                    value={currentStyle.titleDescriptionSpacing}
                    onChange={(value) => {
                      const newStyle = { ...currentStyle };
                      newStyle.titleDescriptionSpacing = value;
                      onStyleChange(newStyle);
                    }}
                    min={4}
                    max={24}
                  />

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-4">Marges internes des cartes</h3>
                    <div className="space-y-4">
                      <SizeControl
                        label="Haut"
                        value={currentStyle.itemPadding.top}
                        onChange={(value) => {
                          const newStyle = { ...currentStyle };
                          newStyle.itemPadding.top = value;
                          onStyleChange(newStyle);
                        }}
                        min={0}
                        max={48}
                      />

                      <SizeControl
                        label="Droite"
                        value={currentStyle.itemPadding.right}
                        onChange={(value) => {
                          const newStyle = { ...currentStyle };
                          newStyle.itemPadding.right = value;
                          onStyleChange(newStyle);
                        }}
                        min={0}
                        max={48}
                      />

                      <SizeControl
                        label="Bas"
                        value={currentStyle.itemPadding.bottom}
                        onChange={(value) => {
                          const newStyle = { ...currentStyle };
                          newStyle.itemPadding.bottom = value;
                          onStyleChange(newStyle);
                        }}
                        min={0}
                        max={48}
                      />

                      <SizeControl
                        label="Gauche"
                        value={currentStyle.itemPadding.left}
                        onChange={(value) => {
                          const newStyle = { ...currentStyle };
                          newStyle.itemPadding.left = value;
                          onStyleChange(newStyle);
                        }}
                        min={0}
                        max={48}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Bordures */}
          <AccordionItem value="borders" className="px-6">
            <AccordionTrigger>Bordures</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Afficher les bordures</Label>
                  <Switch
                    checked={currentStyle.card.showBorder}
                    onCheckedChange={(checked) => {
                      const newStyle = { ...currentStyle };
                      newStyle.card.showBorder = checked;
                      onStyleChange(newStyle);
                    }}
                  />
                </div>

                {currentStyle.card.showBorder && (
                  <>
                    <SizeControl
                      label="Épaisseur"
                      value={currentStyle.card.borderWidth}
                      onChange={(value) => {
                        const newStyle = { ...currentStyle };
                        newStyle.card.borderWidth = value;
                        onStyleChange(newStyle);
                      }}
                      min={1}
                      max={10}
                    />

                    <ColorPicker
                      label="Couleur"
                      value={currentStyle.card.borderColor}
                      onChange={(value) => {
                        const newStyle = { ...currentStyle };
                        newStyle.card.borderColor = value;
                        onStyleChange(newStyle);
                      }}
                    />
                  </>
                )}

                <SizeControl
                  label="Rayon des coins"
                  value={currentStyle.card.borderRadius}
                  onChange={(value) => {
                    const newStyle = { ...currentStyle };
                    newStyle.card.borderRadius = value;
                    onStyleChange(newStyle);
                  }}
                  min={0}
                  max={32}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Pied de page */}
          <AccordionItem value="footer" className="px-6">
            <AccordionTrigger>Pied de page</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input
                    value={currentStyle.footer.name}
                    onChange={(e) => {
                      const newStyle = { ...currentStyle };
                      newStyle.footer.name = e.target.value;
                      onStyleChange(newStyle);
                    }}
                    placeholder="Votre nom"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sous-titre</Label>
                  <Input
                    value={currentStyle.footer.subtitle}
                    onChange={(e) => {
                      const newStyle = { ...currentStyle };
                      newStyle.footer.subtitle = e.target.value;
                      onStyleChange(newStyle);
                    }}
                    placeholder="Votre titre"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Photo de profil</Label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Changer la photo
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Texte à droite</Label>
                  <Input
                    value={currentStyle.footer.rightText}
                    onChange={(e) => {
                      const newStyle = { ...currentStyle };
                      newStyle.footer.rightText = e.target.value;
                      onStyleChange(newStyle);
                    }}
                    placeholder="Texte à droite"
                  />
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-medium">Tailles</h3>
                  <SizeControl
                    label="Nom"
                    value={currentStyle.footerSize}
                    onChange={(value) => {
                      const newStyle = { ...currentStyle };
                      newStyle.footerSize = value;
                      onStyleChange(newStyle);
                    }}
                    min={12}
                    max={24}
                  />

                  <SizeControl
                    label="Sous-titre"
                    value={currentStyle.footerSubtitleSize}
                    onChange={(value) => {
                      const newStyle = { ...currentStyle };
                      newStyle.footerSubtitleSize = value;
                      onStyleChange(newStyle);
                    }}
                    min={10}
                    max={20}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="px-6 pt-2 pb-6 border-t">
        <label htmlFor="predefined" className="text-sm pt-2 mb-2 block">
          Style prédéfini :
        </label>
        <select
          id="predefined"
          className="w-full h-9 rounded-md border px-3 mb-2 text-sm"
          value={currentStyle.name}
          onChange={(e) => {
            const selectedStyle = stylePresets.find(
              (style) => style.name === e.target.value
            );
            if (selectedStyle) onStyleChange(selectedStyle);
          }}
        >
          {stylePresets.map((style) => (
            <option key={style.name} value={style.name}>
              {style.name}
            </option>
          ))}
        </select>

        <StyleImportExport
          currentStyle={currentStyle}
          onStyleChange={onStyleChange}
        />
      </div>
    </div>
  );
}