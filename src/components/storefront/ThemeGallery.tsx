"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  ExternalLink,
  Search,
  Check
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  PurposeTheme,
  getThemesForPurpose
} from "@/data/purposeThemes";
import { useMerchantRegion } from "@/hooks/useMerchantRegion";
import { toast } from "sonner";

const ThemeGallery = () => {
  const { businessPurpose } = useMerchantRegion();
  const [selectedThemeId, setSelectedThemeId] = useState<string | number>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [themes, setThemes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/themes');
      const data = await response.json();
      setThemes(data);
    } catch (error) {
      toast.error("Failed to fetch themes.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredThemes = themes.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.vertical.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = async (id: string | number, name: string) => {
    try {
      const response = await fetch(`/api/themes/${id}/adopt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setSelectedThemeId(id);
        toast.success(`Theme "${name}" activated successfully!`);
        // Optionally trigger a page refresh or state update in the parent
      }
    } catch (error) {
      toast.error("Failed to activate theme.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search themes..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-accent px-3 py-1">Minimal</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent px-3 py-1">Modern</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent px-3 py-1">Luxury</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredThemes.map((theme) => (
          <Card
            key={theme.id}
            className={`group relative overflow-hidden transition-all duration-300 border-2 ${selectedThemeId === theme.id ? "border-primary ring-4 ring-primary/10 shadow-xl scale-[1.02]" : "hover:border-primary/40"}`}
          >
            <div
              className="h-48 w-full transition-transform duration-500 group-hover:scale-110 flex items-center justify-center text-white"
              style={{ background: theme.preview_url?.includes('gradient') ? theme.preview_url : '#f1f5f9' }}
            >
              {!theme.preview_url?.includes('gradient') && <Search className="h-10 w-10 text-muted-foreground opacity-20" />}
              <span className="text-2xl font-bold opacity-20">{theme.name}</span>
              {selectedThemeId === theme.id && (
                <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white shadow-lg animate-in zoom-in">
                  <Check className="h-5 w-5" />
                </div>
              )}
            </div>

            <CardHeader className="p-4 flex-row items-start justify-between space-y-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-lg">{theme.name}</CardTitle>
                  {theme.isNew && <Badge className="bg-emerald-500 hover:bg-emerald-600">New</Badge>}
                  {theme.isPremium && <Badge variant="secondary">Premium</Badge>}
                </div>
                <CardDescription className="text-xs">{theme.vertical}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="px-4 pb-2">
              <div className="flex flex-wrap gap-1.5">
                {(theme.config?.features || ['RTL Ready', 'Mobile First']).slice(0, 3).map((f: string) => (
                  <span key={f} className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5" /> {f}
                  </span>
                ))}
              </div>
            </CardContent>

            <CardFooter className="p-4 gap-2">
              <Button
                variant={selectedThemeId === theme.id ? "default" : "outline"}
                className="flex-1"
                onClick={() => handleSelect(theme.id, theme.name)}
              >
                {selectedThemeId === theme.id ? "Selected" : "Activate"}
              </Button>
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredThemes.length === 0 && (
        <div className="text-center py-20 border border-dashed rounded-xl">
          <p className="text-muted-foreground">No themes match your search query.</p>
          <Button variant="link" onClick={() => setSearchQuery("")}>Clear search</Button>
        </div>
      )}
    </div>
  );
};

export default ThemeGallery;
