import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

interface VideoDescriptionProps {
    compactViews:string ;
    expandedViews:string ;
    compactDate:string;
    expandedDate:string ;
    description?:string | null ;
}


export const VideoDescription = ({
  compactViews,
  expandedDate,
  expandedViews,
  compactDate,
  description
}: VideoDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onClick={() => setIsExpanded((current) => !current)}
      className="bg-secondary/50 rounded-xl p-3 cursor-pointer hover:bg-secondary/70 transition-colors"
    >
      <div className="flex flex-wrap gap-2 text-sm mb-2">
        <span className="font-medium">{isExpanded ? expandedViews : compactViews} views</span>
        <span className="font-medium">{isExpanded ? expandedDate : compactDate}</span>
      </div>

      <div className="relative">
        <p
            className={cn(
                "text-sm break-words whitespace-pre-wrap", // added break-words
                !isExpanded && "line-clamp-2 overflow-hidden"
            )}
            >
            {description || "No description"}
            </p>

        <div className="flex items-center gap-1 mt-2 text-sm font-medium select-none">
          {isExpanded ? (
            <>
              Show Less <ChevronUpIcon className="size-4" />
            </>
          ) : (
            <>
              Show More <ChevronDownIcon className="size-4" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
