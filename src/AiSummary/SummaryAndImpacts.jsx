import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, Globe, BarChart2 } from "lucide-react";

const SummaryAndImpacts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { article, summary, perspectives } = location.state || {};
  const [parsedPerspectives, setParsedPerspectives] = useState({
    economic: [],
    social: [],
    political: [],
  });

  // Format the date in a more readable way
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Parse perspectives on component mount
  useEffect(() => {
    if (!perspectives) return;
    const parsePerspectives = (text) => {
      const result = { economic: [], social: [], political: [] };
      // Common patterns
      const economicRegex = /economic perspective(?:s)?:?(?:\n|\r\n)([\s\S]*?)(?=(social perspective:|political perspective:|$))/i;
      const socialRegex = /social perspective(?:s)?:?(?:\n|\r\n)([\s\S]*?)(?=(economic perspective:|political perspective:|$))/i;
      const politicalRegex = /political perspective(?:s)?:?(?:\n|\r\n)([\s\S]*?)(?=(economic perspective:|social perspective:|$))/i;
      const econMatch = text.match(economicRegex);
      const socMatch = text.match(socialRegex);
      const polMatch = text.match(politicalRegex);
      if (econMatch && econMatch[1]) {
        result.economic = econMatch[1]
          .split(/\n|\r\n/)
          .map(l => l.replace(/^\s*[\-\•\*\d+\.]/, "").trim())
          .filter(Boolean);
      }
      if (socMatch && socMatch[1]) {
        result.social = socMatch[1]
          .split(/\n|\r\n/)
          .map(l => l.replace(/^\s*[\-\•\*\d+\.]/, "").trim())
          .filter(Boolean);
      }
      if (polMatch && polMatch[1]) {
        result.political = polMatch[1]
          .split(/\n|\r\n/)
          .map(l => l.replace(/^\s*[\-\•\*\d+\.]/, "").trim())
          .filter(Boolean);
      }
      // Fallback: if no structured sections
      if (!result.economic.length && !result.social.length && !result.political.length) {
        const lines = text.split(/\n|\r\n/).filter(Boolean);
        lines.forEach(line => {
          if (/economic/i.test(line)) result.economic.push(line.trim());
          else if (/social/i.test(line)) result.social.push(line.trim());
          else if (/political/i.test(line)) result.political.push(line.trim());
        });
      }
      return result;
    };
    setParsedPerspectives(parsePerspectives(perspectives));
  }, [perspectives]);

  if (!article) {
    return (
      <div className="min-h-screen bg-blue-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-red-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Article Not Found
          </h1>
          <p className="mt-4 text-blue-800">
            The article you're looking for is unavailable. The content may have been
            removed or you might have followed an invalid link.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowLeft className="mr-2" size={18} />
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Check if we have any perspectives to display
  const hasEconomic = parsedPerspectives.economic.length > 0;
  const hasSocial = parsedPerspectives.social.length > 0;
  const hasPolitical = parsedPerspectives.political.length > 0;
  const hasPerspectives = hasEconomic || hasSocial || hasPolitical;

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-3xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <ArrowLeft className="mr-2" size={18} />
          Back to Articles
        </button>

        <article className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header Section with Article Title and Meta */}
          <header className="p-6 border-b border-blue-100">
            <div className="flex items-center text-blue-600 text-sm font-medium mb-2">
              <Globe size={16} className="mr-1" />
              <span>{article.source?.name || "News Source"}</span>
              <span className="mx-2">•</span>
              <Clock size={16} className="mr-1" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>

            <h1 className="text-2xl font-bold text-blue-900 mb-2">
              {article.title}
            </h1>

            {article.author && (
              <p className="text-blue-700 text-sm">By {article.author}</p>
            )}
          </header>

          {/* Summary Section */}
          <section className="p-6 border-b border-blue-100">
            <h2 className="flex items-center text-lg font-semibold text-blue-800 mb-3">
              <BookOpen size={18} className="mr-2" />
              Executive Summary
            </h2>
            <p className="text-blue-900 leading-relaxed">{summary || article.description || "Summary not available."}</p>
          </section>

          {/* Key Perspectives Section */}
          <section className="p-6">
            <h2 className="flex items-center text-lg font-semibold text-blue-800 mb-4">
              <BarChart2 size={18} className="mr-2" />
              Key Perspectives
            </h2>

            {!hasPerspectives && (
              <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800">
                No structured perspectives available for this article.
              </div>
            )}

            <div className="space-y-6">
              {/* Economic Perspectives */}
              {hasEconomic && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-blue-800 font-bold text-lg mb-3 border-b border-blue-200 pb-2">
                    Economic Perspective
                  </h3>
                  <ul className="space-y-2">
                    {parsedPerspectives.economic.map((point, index) => (
                      <li key={`econ-${index}`} className="flex items-start">
                        <div className="text-blue-600 mr-2 mt-1 flex-shrink-0 font-bold">
                          •
                        </div>
                        <p className="text-blue-900">{point}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Social Perspectives */}
              {hasSocial && (
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h3 className="text-indigo-800 font-bold text-lg mb-3 border-b border-indigo-200 pb-2">
                    Social Perspective
                  </h3>
                  <ul className="space-y-2">
                    {parsedPerspectives.social.map((point, index) => (
                      <li key={`soc-${index}`} className="flex items-start">
                        <div className="text-indigo-600 mr-2 mt-1 flex-shrink-0 font-bold">
                          •
                        </div>
                        <p className="text-indigo-900">{point}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Political Perspectives */}
              {hasPolitical && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-purple-800 font-bold text-lg mb-3 border-b border-purple-200 pb-2">
                    Political Perspective
                  </h3>
                  <ul className="space-y-2">
                    {parsedPerspectives.political.map((point, index) => (
                      <li key={`pol-${index}`} className="flex items-start">
                        <div className="text-purple-600 mr-2 mt-1 flex-shrink-0 font-bold">
                          •
                        </div>
                        <p className="text-purple-900">{point}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* If no perspectives were extracted properly, show the raw text */}
            {!hasPerspectives && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <h3 className="text-gray-700 font-medium mb-2">Original Perspectives</h3>
                <div className="whitespace-pre-line text-gray-600">{perspectives || article.description || "No perspectives available."}</div>
              </div>
            )}

            {/* Read Original Article button if URL is available */}
            {article.url && (
              <div className="mt-8 flex justify-center">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition flex items-center font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Read Original Article
                </a>
              </div>
            )}
          </section>
        </article>
      </div>
    </div>
  );
};

export default SummaryAndImpacts;
