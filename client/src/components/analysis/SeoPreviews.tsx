import { Globe, ImageIcon } from "lucide-react";
import { type MetaTags } from "@shared/schema";
import { useState } from "react";

interface PreviewProps {
  meta: MetaTags;
  url: string;
}

export function GooglePreview({ meta, url }: PreviewProps) {
  let displayUrl = url;
  try {
    displayUrl = new URL(url).hostname;
  } catch {}
  
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <div className="bg-slate-100 p-1 rounded-full flex-shrink-0">
          <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
        </div>
        <div className="flex flex-col text-xs sm:text-sm leading-tight min-w-0">
          <span className="text-slate-900 font-medium truncate">{meta.ogSiteName || displayUrl}</span>
          <span className="text-slate-500 truncate">{url}</span>
        </div>
      </div>
      <h3 className="text-[#1a0dab] text-base sm:text-xl hover:underline cursor-pointer font-normal line-clamp-2" data-testid="text-google-title">
        {meta.title || "No Title Found"}
      </h3>
      <p className="text-slate-600 text-xs sm:text-sm mt-1 line-clamp-2" data-testid="text-google-description">
        {meta.description || "No description provided for this page. Google will generate a snippet from the page content."}
      </p>
    </div>
  );
}

export function SocialPreview({ meta, url }: PreviewProps) {
  let domain = url;
  try {
    domain = new URL(url).hostname.toUpperCase();
  } catch {}
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-[#f0f2f5] p-4 sm:p-6 rounded-xl border border-slate-200">
      <div className="max-w-full sm:max-w-[500px] mx-auto bg-white rounded-lg overflow-hidden border border-slate-300 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
        <div className="aspect-[1.91/1] bg-slate-100 relative w-full overflow-hidden flex items-center justify-center">
          {meta.ogImage && !imgError ? (
            <img 
              src={meta.ogImage} 
              alt="Social Preview" 
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
              data-testid="img-og-preview"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
              <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 opacity-50" />
              <span className="text-xs sm:text-sm font-medium">No Image Found</span>
            </div>
          )}
        </div>
        <div className="p-2.5 sm:p-3 bg-[#f0f2f5] border-t border-slate-200">
          <p className="text-[10px] sm:text-xs text-slate-500 uppercase font-medium tracking-wide mb-1 truncate">{domain}</p>
          <h4 className="text-slate-900 font-bold text-sm sm:text-base leading-tight mb-1 line-clamp-2" data-testid="text-og-title">
            {meta.ogTitle || meta.title || "No Title Available"}
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm line-clamp-1" data-testid="text-og-description">
            {meta.ogDescription || meta.description || "No description available"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TwitterPreview({ meta, url }: PreviewProps) {
  let domain = url;
  try {
    domain = new URL(url).hostname;
  } catch {}
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-[#f7f9f9] p-4 sm:p-6 rounded-xl border border-slate-200">
      <div className="max-w-full sm:max-w-[500px] mx-auto bg-white rounded-2xl overflow-hidden border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors">
        <div className="aspect-[2/1] bg-slate-100 relative w-full overflow-hidden flex items-center justify-center">
          {meta.twitterImage && !imgError ? (
            <img 
              src={meta.twitterImage} 
              alt="Twitter Preview" 
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
              data-testid="img-twitter-preview"
            />
          ) : (meta.ogImage && !imgError) ? (
            <img 
              src={meta.ogImage} 
              alt="Twitter Preview Fallback" 
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
              <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 opacity-50" />
            </div>
          )}
        </div>
        <div className="p-2.5 sm:p-3">
          <h4 className="text-slate-900 font-bold text-sm sm:text-[15px] leading-tight mb-0.5 line-clamp-2" data-testid="text-twitter-title">
            {meta.twitterTitle || meta.ogTitle || meta.title || "No Title"}
          </h4>
          <p className="text-slate-500 text-xs sm:text-[15px] line-clamp-2 leading-snug" data-testid="text-twitter-description">
            {meta.twitterDescription || meta.ogDescription || meta.description || "No description"}
          </p>
          <p className="text-slate-400 text-xs sm:text-[15px] mt-1 flex items-center gap-1">
            <Globe className="w-3 h-3" /> {domain}
          </p>
        </div>
      </div>
    </div>
  );
}
