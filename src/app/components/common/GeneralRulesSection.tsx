"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "react-feather";
import { useGeneralData } from "@/hooks/useGeneralData";
import { useAuth } from "@/hooks/useAuth";

export default function GeneralRulesSection() {
  const { isAuthenticated } = useAuth();
  const { generalRules, isLoadingRules, rulesError } = useGeneralData();
  const [isExpanded, setIsExpanded] = useState(true);

  // Don't show anything if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Don't show anything while loading or if there's an error
  if (isLoadingRules || rulesError || !generalRules) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 mb-8">
      <div className="container-custom px-4">
        <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between py-4 text-left hover:bg-blue-100 transition-colors">
          <div className="flex items-center space-x-3">
            <Info className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-blue-900">Peraturan Umum</h3>
          </div>
          <div className="flex items-center space-x-2 text-blue-600">
            <span className="text-sm font-medium">{isExpanded ? "Sembunyikan" : "Lihat Peraturan"}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {isExpanded && (
          <div className="pb-4">
            <div className="border-t border-blue-200 pt-4">
              <div className="prose prose-blue w-full text-sm text-blue-800" dangerouslySetInnerHTML={{ __html: generalRules.content }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
