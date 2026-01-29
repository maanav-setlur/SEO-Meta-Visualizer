import { type SeoIssue, type MetaTags } from "@shared/schema";
import { Lightbulb, ArrowRight, CheckCircle2, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuggestionsProps {
  issues: SeoIssue[];
  meta: MetaTags;
}

interface Suggestion {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: string;
}

export function Suggestions({ issues, meta }: SuggestionsProps) {
  const suggestions: Suggestion[] = [];

  const titleLength = meta.title?.length || 0;
  const descLength = meta.description?.length || 0;

  if (!meta.title || titleLength === 0) {
    suggestions.push({
      title: "Add a page title",
      description: "Every page needs a unique, descriptive title tag. Aim for 50-60 characters that clearly describe your page content.",
      impact: "high",
      category: "Title"
    });
  } else if (titleLength < 30) {
    suggestions.push({
      title: "Expand your page title",
      description: `Your title is only ${titleLength} characters. Add more descriptive keywords to reach the optimal 50-60 character range.`,
      impact: "medium",
      category: "Title"
    });
  } else if (titleLength > 60) {
    suggestions.push({
      title: "Shorten your page title",
      description: `Your title is ${titleLength} characters. Google typically displays 50-60 characters. Consider trimming to avoid truncation in search results.`,
      impact: "medium",
      category: "Title"
    });
  }

  if (!meta.description || descLength === 0) {
    suggestions.push({
      title: "Add a meta description",
      description: "Write a compelling 150-160 character description that summarizes your page and encourages clicks from search results.",
      impact: "high",
      category: "Description"
    });
  } else if (descLength < 120) {
    suggestions.push({
      title: "Expand your meta description",
      description: `Your description is ${descLength} characters. Add more detail to reach 150-160 characters for maximum visibility in search results.`,
      impact: "medium",
      category: "Description"
    });
  } else if (descLength > 160) {
    suggestions.push({
      title: "Trim your meta description",
      description: `Your description is ${descLength} characters. Google typically shows 150-160 characters. The excess may be cut off.`,
      impact: "low",
      category: "Description"
    });
  }

  if (!meta.ogTitle && !meta.ogDescription) {
    suggestions.push({
      title: "Add Open Graph tags for social sharing",
      description: "Add og:title, og:description, and og:image tags so your content looks great when shared on Facebook, LinkedIn, and other platforms.",
      impact: "high",
      category: "Social"
    });
  } else if (!meta.ogImage) {
    suggestions.push({
      title: "Add an Open Graph image",
      description: "Pages with images get significantly more engagement when shared. Add a 1200x630px image using the og:image tag.",
      impact: "high",
      category: "Social"
    });
  }

  if (!meta.twitterCard) {
    suggestions.push({
      title: "Add Twitter Card tags",
      description: "Add twitter:card, twitter:title, and twitter:image tags for rich previews when your content is shared on Twitter/X.",
      impact: "medium",
      category: "Social"
    });
  }

  if (!meta.canonical) {
    suggestions.push({
      title: "Add a canonical URL",
      description: "A canonical tag helps prevent duplicate content issues by telling search engines which version of a page is the primary one.",
      impact: "medium",
      category: "Technical"
    });
  }

  const impactColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-blue-100 text-blue-700 border-blue-200"
  };

  const impactLabels = {
    high: "High Impact",
    medium: "Medium Impact", 
    low: "Low Impact"
  };

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-12 bg-green-50 rounded-xl border border-green-200">
        <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h3 className="text-xl font-bold text-green-800 mb-2">Perfect Score!</h3>
        <p className="text-green-600">Your page has all the essential SEO elements. Great job!</p>
      </div>
    );
  }

  const highImpact = suggestions.filter(s => s.impact === "high");
  const mediumImpact = suggestions.filter(s => s.impact === "medium");
  const lowImpact = suggestions.filter(s => s.impact === "low");

  const potentialGain = highImpact.length * 15 + mediumImpact.length * 5;

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-xl p-4 sm:p-6 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-lg">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 mb-1">
              {suggestions.length} Improvement{suggestions.length !== 1 ? 's' : ''} Found
            </h3>
            <p className="text-slate-600 text-sm">
              Implementing these suggestions could increase your score by up to <span className="font-bold text-primary">+{potentialGain} points</span>
            </p>
          </div>
        </div>
      </div>

      {/* Priority Legend */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-full font-medium">
          <Zap className="w-3 h-3" /> High Impact (+15 pts)
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
          Medium Impact (+5 pts)
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
          Low Impact
        </span>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {suggestions.map((suggestion, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border p-4 sm:p-5 hover:shadow-md transition-shadow"
            data-testid={`suggestion-${idx}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-slate-100 rounded-lg flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-slate-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-semibold text-slate-900">{suggestion.title}</h4>
                    <span className={cn(
                      "px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full border",
                      impactColors[suggestion.impact]
                    )}>
                      {impactLabels[suggestion.impact]}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">{suggestion.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
