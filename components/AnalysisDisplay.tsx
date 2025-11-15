import React from 'react';

interface AnalysisDisplayProps {
  analysis: string;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  // Simple markdown-to-HTML conversion
  const formatText = (text: string) => {
    return text
      .split('\n')
      .map(line => {
        if (line.startsWith('### ')) return `<h3 class="text-xl font-semibold mt-5 mb-2 text-cyan-300">${line.substring(4)}</h3>`;
        if (line.startsWith('**') && line.endsWith('**')) return `<p class="font-bold text-gray-200 my-1">${line.substring(2, line.length - 2)}</p>`;
        if (line.startsWith('* ')) return `<li class="ml-5 list-disc text-gray-300">${line.substring(2)}</li>`;
        return `<p class="my-1 text-gray-300/90 font-light leading-relaxed">${line}</p>`;
      })
      .join('');
  };

  return (
    <div className="w-full mt-6 bg-black/20 p-6 rounded-2xl border border-cyan-500/20">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">
        Análise Técnica Visual
      </h2>
      <div 
        className="prose prose-invert prose-p:text-gray-300/90 prose-p:font-light prose-li:text-gray-300/90 text-base"
        dangerouslySetInnerHTML={{ __html: formatText(analysis) }}
      />
    </div>
  );
};