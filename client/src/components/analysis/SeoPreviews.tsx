import { Globe, Facebook, Twitter, ImageIcon } from "lucide-react";
import { type MetaTags } from "@shared/schema";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PreviewProps {
  meta: MetaTags;
  url: string;
}

export function GooglePreview({ meta, url }: PreviewProps) {
  const displayUrl = new URL(url).hostname;
  
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm max-w-2xl">
      <div className="flex items-center gap-2 mb-1">
        <div className="bg-slate-100 p-1 rounded-full">
           {/* Fallback favicon */}
           <Globe className="w-4 h-4 text-slate-500" />
        </div>
        <div className="flex flex-col text-sm leading-tight">
          <span className="text-slate-900 font-medium">{meta.ogSiteName || displayUrl}</span>
          <span className="text-slate-500">{url}</span>
        </div>
      </div>
      <h3 className="text-[#1a0dab] text-xl hover:underline cursor-pointer font-normal truncate">
        {meta.title || "No Title Found"}
      </h3>
      <p className="text-slate-600 text-sm mt-1 line-clamp-2">
        {meta.description || "No description provided for this page. Google will generate a snippet from the page content."}
      </p>
    </div>
  );
}

export function SocialPreview({ meta, url }: PreviewProps) {
  const domain = new URL(url).hostname.toUpperCase();
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-[#f0f2f5] p-6 rounded-xl border border-slate-200">
      <div className="max-w-[500px] mx-auto bg-white rounded-lg overflow-hidden border border-slate-300 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
        <div className="aspect-[1.91/1] bg-slate-100 relative w-full overflow-hidden flex items-center justify-center">
          {meta.ogImage && !imgError ? (
            <img 
              src={meta.ogImage} 
              alt="Social Preview" 
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
              <ImageIcon className="w-12 h-12 opacity-50" />
              <span className="text-sm font-medium">No Image Found</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-[#f0f2f5] border-t border-slate-200">
          <p className="text-xs text-slate-500 uppercase font-medium tracking-wide mb-1">{domain}</p>
          <h4 className="text-slate-900 font-bold leading-tight mb-1 line-clamp-2">
            {meta.ogTitle || meta.title || "No Title Available"}
          </h4>
          <p className="text-slate-600 text-sm line-clamp-1">
            {meta.ogDescription || meta.description || "No description available"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TwitterPreview({ meta, url }: PreviewProps) {
  const domain = new URL(url).hostname;
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-[#f7f9f9] p-6 rounded-xl border border-slate-200">
      <div className="max-w-[500px] mx-auto bg-white rounded-2xl overflow-hidden border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors">
        <div className="aspect-[2/1] bg-slate-100 relative w-full overflow-hidden flex items-center justify-center">
           {meta.twitterImage && !imgError ? (
            <img 
              src={meta.twitterImage} 
              alt="Twitter Preview" 
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
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
              <ImageIcon className="w-10 h-10 opacity-50" />
            </div>
          )}
        </div>
        <div className="p-3">
          <h4 className="text-slate-900 font-bold text-[15px] leading-tight mb-0.5 line-clamp-2">
            {meta.twitterTitle || meta.ogTitle || meta.title || "No Title"}
          </h4>
          <p className="text-slate-500 text-[15px] line-clamp-2 leading-snug">
            {meta.twitterDescription || meta.ogDescription || meta.description || "No description"}
          </p>
          <p className="text-slate-400 text-[15px] mt-1 flex items-center gap-1">
            <Globe className="w-3 h-3" /> {domain}
          </p>
        </div>
      </div>
    </div>
  );
}
